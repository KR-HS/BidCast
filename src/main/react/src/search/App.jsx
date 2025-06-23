import React, { useEffect, useState } from 'react';
import './search.css';
import Loader from "../Loader/Loader";

export default function AuctionSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const [auctionList, setAuctionList] = useState([]);

    // ✅ 여기서 getStatusLabel 함수 정의
    const getStatusLabel = (status) => {
        switch ((status || '').toUpperCase()) {
            case 'LIVE':
            case '진행중':
                return '진행중';
            case 'END':
            case '마감':
            case '종료':
                return '종료';
            default:
                return '알 수 없음';
        }
    };



    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('/api/auctions/top6', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error("경매 데이터를 불러오는 데 실패했습니다.");

                const data = await response.json();
                setAuctionList(data);
            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                    const loader = document.getElementById('loader');
                    if (loader) {
                        loader.classList.add('fade-out');
                        setTimeout(() => loader.style.display = 'none', 500);
                    }
                }, 500);
            }
        };

        fetchAuctions();
    }, []);

    const handleCardClick = (id) => {
        window.location.href = `http://localhost:8888/bidGuest.do?roomid=${id}`;
    };

    if (isLoading) return <Loader />;

    return (
        <section className="auction-search">
            <div className="search-header">
                <h2>경매검색</h2>
                <p>다양한 필터를 활용하여 원하는 라이브를 빠르게 찾아보세요</p>
                <div className="search-bar-row">
                    <input className="search-input" placeholder="제목 또는 호스트를 입력하세요" />
                    <select className="search-select">
                        <option>진행중</option>
                        <option>종료</option>
                    </select>
                    <button className="search-btn">검색</button>
                </div>
            </div>

            <div className="card-list">
                {auctionList.map(item => (
                    <div
                        className="card"
                        key={item.auctionId}
                        onClick={() => handleCardClick(item.auctionId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="thumbnail">
                            <img src={'/img/thumbnail.png'} alt="썸네일" />
                            <span className={`cast-state ${getStatusLabel(item.status)}`}>
                                {getStatusLabel(item.status)}
                            </span>
                        </div>
                        <div className="card-desc">
                            <div className="product-title">경매 제목: {item.title}</div>
                            <div className="time-info">
                                시작: {new Date(item.startTime).toLocaleString()}<br />
                                종료: {new Date(item.endTime).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
