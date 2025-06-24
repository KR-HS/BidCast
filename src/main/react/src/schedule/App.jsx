import React, { useEffect, useState } from 'react';
import Calendar from "./calendar";
import Loader from "../Loader/Loader";

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

    // 날짜/태그가 바뀔 때마다 API 호출
    useEffect(() => {
        const fetchAuctionData = async () => {
            const params = new URLSearchParams({ date: formatDate(selectedDate) });
            if (selectedTag) params.append('tag', selectedTag);

            try {
                const res = await fetch(`/api/auctions/schedule?${params.toString()}`);
                const data = await res.json();
                const safeData = Array.isArray(data) ? data : [];
                setAuctionData(safeData);

                // 태그 목록 추출 (null/빈 문자열/undefined 모두 안전하게 처리)
                const tags = Array.from(
                    new Set(
                        safeData.flatMap(item => {
                            if (!item.tags) return [];
                            if (typeof item.tags === 'string') {
                                return item.tags.trim() === ''
                                    ? []
                                    : item.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                            }
                            if (Array.isArray(item.tags)) return item.tags.filter(tag => tag);
                            return [];
                        })
                    )
                );
                setTagList(tags);
                // 디버깅용 로그
                // console.log("경매 데이터:", safeData);
                // console.log("태그 목록:", tags);
            } catch (err) {
                console.error('경매 데이터 불러오기 실패:', err);
                setAuctionData([]);
                setTagList([]);
            }
        };

        fetchAuctionData();
    }, [selectedDate, selectedTag]);

    // 오늘인지 판별
    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

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
                        {auctionData.map(item => (
                            <div className="card" key={item.auctionId || item.id}>
                                <div className="thumbnail">
                                    <img src={item.image || item.imgUrl || "./img/thumbnail.png"} alt="썸네일"/>
                                    <span className="cast-state">{item.status}</span>
                                    <div className="guest-count">참여자수: {item.guestCount}</div>
                                    <div className="host-name">경매사: {item.hostName}</div>
                                </div>
                                <div className="title">
                                    <h3>{item.title}</h3>
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
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
