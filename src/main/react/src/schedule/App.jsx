import React, { useEffect, useState } from 'react';
import Calendar from "./calendar";
import Loader from "../Loader/Loader";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const today = new Date();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTag, setSelectedTag] = useState(null);
    const [tagList, setTagList] = useState([]);
    const [auctionData, setAuctionData] = useState([]);
    const [userKey, setUserKey] = useState(null);

    const formatDate = (date) =>
        `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;


    const [likedMap, setLikedMap] = useState({});

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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) return;
                const data = await res.json();
                setUserKey(data.userKey); // userKey 상태 저장
            } catch (err) {
                console.error("유저 정보 가져오기 실패:", err);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        fetch('/api/auctions/tags')
            .then(res => res.json())
            .then(data => setTagList(data.map(tag => tag.tagName)))
            .catch(err => {
                console.error('태그 목록 불러오기 실패:', err);
                setTagList([]);
            });
    }, []);

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
        if (!userKey) return; // 로그인 안 되어 있으면 좋아요 목록 호출 안함

        const fetchLikedAuctionIds = async () => {
            try {
                const res = await fetch(`/api/favorites/${userKey}`);
                const likedIds = await res.json(); // ex) [8, 10, 13]
                const newLikedMap = {};
                likedIds.forEach(id => {
                    newLikedMap[id] = true;
                });
                setLikedMap(newLikedMap);
            } catch (err) {
                console.error("좋아요 목록 불러오기 실패:", err);
            }
        };
        fetchLikedAuctionIds();
    }, [userKey]);



    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    // 좋아요 토글
    const handleLikeToggle = async (auctionId) => {
        if (!userKey) {
            alert("로그인이 필요합니다.");
            return;
        }

        const liked = likedMap[auctionId] || false;

        try {
            if (liked) {
                await fetch(`/api/favorites/like?userKey=${userKey}&aucKey=${auctionId}`, {
                    method: 'DELETE'
                });
            } else {
                await fetch(`/api/favorites/like?userKey=${userKey}&aucKey=${auctionId}`, {
                    method: 'POST'
                });
            }

            setLikedMap(prev => ({
                ...prev,
                [auctionId]: !liked
            }));
        } catch (err) {
            console.error("좋아요 처리 실패:", err);
        }
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
                                <div className="card" key={item.auctionId}>
                                    <div className="thumbnail">
                                        <img src={item.image} alt="썸네일"/>
                                        <span className={`cast-state status-${status}`}>{status}</span>
                                        <button
                                            className={`like-btn${liked ? ' liked' : ''}`}
                                            onClick={() => handleLikeToggle(item.auctionId)}
                                            aria-label={liked ? "좋아요 취소" : "좋아요"}
                                        >
                                            {liked ? (
                                                <FaHeart color="red" size={20} className="heart-icon" />
                                            ) : (
                                                <FaRegHeart color="black" size={20} className="heart-icon" />
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
