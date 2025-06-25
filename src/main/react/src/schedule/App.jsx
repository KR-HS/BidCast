import React, { useEffect, useState } from 'react';
import Calendar from "./calendar";
import Loader from "../Loader/Loader";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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

    //태그 불러옴
    useEffect(() => {
        fetch('/api/auctions/tags')
            .then(res => res.json())
            .then(data => {
                // data가 [{tagKey: 1, tagName: "패션"}, ...] 구조라면
                setTagList(data.map(tag => tag.tagName));
            })
            .catch(err => {
                console.error('태그 목록 불러오기 실패:', err);
                setTagList([]);
            });
    }, []);

    // 날짜/태그가 바뀔 때마다 API 호출
    useEffect(() => {
        const fetchAuctionData = async () => {
            setAuctionData([]);
            const params = new URLSearchParams({ date: formatDate(selectedDate) });
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
        // 새로운 경매 데이터가 들어오면 likedMap에 초기값(false) 세팅
        const newMap = {};
        auctionData.forEach(item => {
            newMap[item.auctionId] = likedMap[item.auctionId] || false;
        });
        setLikedMap(newMap);
        // eslint-disable-next-line
    }, [auctionData]);


    // 오늘인지 판별
    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const handleLikeToggle = (auctionId) => {
        setLikedMap(prev => ({
            ...prev,
            [auctionId]: !prev[auctionId]
        }));
        // 실제 서비스에서는 여기서 API 호출로 좋아요 상태를 서버에 반영해야 함
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <section>
            <div className="calender">
                <div className="calendar-header">
                    <button className="calendar-tab active">경매일정</button>
                </div>
                <div className="main-section">
                    <div className="calendar-section">
                        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
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
                                <div className="card" key={item.auctionId || item.id}>
                                    <div className="thumbnail">
                                        <img src={item.thumbnailUrl} alt="썸네일"/>
                                        <span className={`cast-state status-${status}`}>{status}</span>
                                        <button
                                            className={`like-btn${liked ? ' liked' : ''}`}
                                            onClick={() => handleLikeToggle(item.auctionId)}
                                            aria-label={liked ? "좋아요 취소" : "좋아요"}
                                        >
                                            {liked ? (
                                                <FaHeart color="red" size={20} />
                                            ) : (
                                                <FaRegHeart color="black" size={20} />
                                            )}
                                        </button>

                                    </div>
                                    <div className="info">
                                        <div className="info-title">
                                            <h3>{item.title}</h3>
                                            <div className="info-content">
                                                <div className="guest-count">참여자수: {item.guestCount}</div>
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
    );
}
