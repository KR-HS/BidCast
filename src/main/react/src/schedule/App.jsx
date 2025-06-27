import React, {useEffect, useRef, useState} from 'react';
import Calendar from "./calendar";
import Loader from "../Loader/Loader";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {io} from 'socket.io-client';
import MenuBtn from "../MenuBtn/MenuBtn";

const today = new Date();


export default function App() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);
    // 선택 날짜
    const [selectedDate, setSelectedDate] = useState(today);
    // 선택된 태그
    const [selectedTag, setSelectedTag] = useState(null);
    // 태그 목록
    const [tagList, setTagList] = useState([]);
    // 경매 리스트
    const [auctionData, setAuctionData] = useState([]);
    const [userKey, setUserKey] = useState(null);
    const [guestCounts, setGuestCounts] = useState({});
    const socket = useRef(null);

    // 날짜 포맷 함수
    const formatDate = (date) =>
        `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    //좋아요
    const [likedMap, setLikedMap] = useState({});

    // 로딩 처리
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);


    const [user, setUser] = useState(null);
    useEffect(() => {
        // 세션데이터
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response) {
                    const data = await response.json();
                    // console.log("사용자 정보:", data);
                    setUser(data);
                    setUserKey(data.userKey)
                }
            } catch (error) {
                console.error("사용자 정보 요청 실패:", error);
            }
        };
        fetchUserInfo();
    }, []);


    //태그 불러옴
    useEffect(() => {
        fetch('/api/auctions/tags')
            .then(res => res.json())
            .then(data => setTagList(data.map(tag => tag.tagName)))
            .catch(err => {
                console.error('태그 목록 불러오기 실패:', err);
                setTagList([]);
            });
    }, []);

    // 날짜/태그가 바뀔 때마다 API 호출
    useEffect(() => {
        const fetchAuctionData = async () => {
            setAuctionData([]);
            const params = new URLSearchParams({date: formatDate(selectedDate)});
            if (selectedTag) params.append('tag', selectedTag);

            try {
                const res = await fetch(`/api/auctions/schedule?${params.toString()}`);
                const data = await res.json();
                setAuctionData(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('경매 데이터 불러오기 실패:', err);
                setAuctionData([]);
            }
        };
        fetchAuctionData();
    }, [selectedDate, selectedTag]);

    useEffect(() => {
        if (!userKey) return;

        fetch(`/api/favorites/ids/${userKey}`)
            .then(res => res.json())
            .then(ids => {
                const map = {};
                ids.forEach(id => {
                    map[id] = true;
                });
                setLikedMap(map);
            })
            .catch(err => {
                console.error("좋아요 ID 목록 불러오기 실패:", err);
            });
    }, [userKey]);

    //웹소켓 연결
    useEffect(() => {
        socket.current = io('https://bidcastserver.kro.kr', {transports: ['websocket']});

        return () => {
            if (socket.current) socket.current.disconnect();
        };

    }, []);

    //auctionData가 바뀔 때마다 auctionIds로 emit
    useEffect(() => {
        if (!socket.current || auctionData.length === 0) return;

        const auctionIds = auctionData.map(item => item.auctionId);
        // console.log("경매 방번호들",auctionIds)
        socket.current.emit('get-guest-counts', {auctionIds}, (data) => {
            // console.log("실시간 경매자수 받아오기",data);
            setGuestCounts(prev => ({...prev, ...data}));
        });

        socket.current.on('guestCountUpdate', (data) => {
            // console.log("경매 시청자수 변환시 받은 데이터",data);
            setGuestCounts(prev => ({
                ...prev,
                [data.auctionId]: data.guestCount
            }));
        });

        return () => {
            if (socket.current) {
                socket.current.off('guestCountUpdate');
            }
        };
    }, [auctionData]);

    // 오늘인지 판별
    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // 좋아요 토글
    const handleLikeToggle = async (auctionId) => {
        if (!userKey) {
            alert("로그인이 필요합니다.");
            window.location.href = '/login.do';
            return;
        }

        const liked = likedMap[auctionId] || false;
        try {
            if (liked) {
                await fetch(`/api/favorites/like?userKey=${userKey}&aucKey=${auctionId}`, {method: 'DELETE'});
            } else {
                await fetch(`/api/favorites/like?userKey=${userKey}&aucKey=${auctionId}`, {method: 'POST'});
            }
            // 좋아요 변경 후 서버에서 최신 상태 다시 fetch
            const res = await fetch(`/api/favorites/ids/${userKey}`);
            const likedIds = await res.json();
            const newLikedMap = {};
            likedIds.forEach(id => {
                newLikedMap[id] = true;
            });
            setLikedMap(newLikedMap);
        } catch (err) {
            console.error("좋아요 처리 실패:", err);
        }
    };


    if (isLoading) {
        return <Loader/>;
    }

    return (
        <>
            <section>
                <div className="calender">
                    <div className="calendar-header">
                        <button className="calendar-tab active">경매일정</button>
                    </div>
                    <div className="main-section">
                        <div className="calendar-section">
                            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                        </div>
                        <div className="auction-list">
                            <div className="auction-list-header">
                            <span className="auction-date">
                                {formatDate(selectedDate)}
                                {isToday(selectedDate) && <span className="today-label"> (오늘)</span>}
                            </span>
                            </div>
                            <div className="tag-list">
                                {tagList.length === 0 && (
                                    <span className="tag-empty">등록된 태그가 없습니다</span>
                                )}
                                {tagList.map(tag => (
                                    <button
                                        key={tag}
                                        className={`tag-btn${selectedTag === tag ? ' active' : ''}`}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cast-list">
                    <div className="auction-count">
                        {auctionData.length}건
                    </div>
                    <div className="card-list">
                        <div className="card-list-header">
                            {auctionData.length === 0 && (
                                <div className="empty-message">해당 조건의 경매가 없습니다.</div>
                            )}
                            {auctionData.map(item => {
                                const status = item.status;
                                const liked = likedMap[item.auctionId] || false;
                                return (
                                    <div className="card"
                                         key={item.auctionId || item.id}
                                         onClick={() => {
                                             if (!user || !user.loginId) {
                                                 window.location.href = '/login.do';
                                                 return;
                                             }

                                             if (user.loginId === item.hostId) {
                                                 window.location.href = `/bidHost.do?roomId=${item.auctionId}`;
                                             } else {
                                                 window.location.href = `/bidGuest.do?roomId=${item.auctionId}`;
                                             }
                                         }}
                                         style={{cursor: "pointer"}}
                                    >
                                        <div className="thumbnail">
                                            <img src={item.image} alt="썸네일"/>
                                            <span className={`cast-state status-${status}`}>{status}</span>
                                            <button
                                                className={`like-btn${liked ? ' liked' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();  // 이거 꼭 있어야 함
                                                    handleLikeToggle(item.auctionId);
                                                }}
                                            >
                                                {liked ? (
                                                    <FaHeart color="red" size={20} className="heart-icon"/>
                                                ) : (
                                                    <FaRegHeart color="black" size={20} className="heart-icon"/>
                                                )}
                                            </button>

                                        </div>
                                        <div className="info">
                                            <div className="info-title">
                                                <h3>{item.title}</h3>
                                                <div className="info-content">
                                                    <div
                                                        className="guest-count">참여자수: {guestCounts[item.auctionId] ?? 0}</div>
                                                    <div className="host-name">경매사: {item.hostName}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tag-list-inline">
                                            {(typeof item.tags === 'string'
                                                    ? item.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                                                    : Array.isArray(item.tags)
                                                        ? item.tags.filter(tag => tag)
                                                        : []
                                            ).map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <MenuBtn></MenuBtn>
        </>
    );
}
