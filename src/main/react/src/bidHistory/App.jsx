import './bidHistory.css';
import React, {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

export default function App() {

    const [isLoading, setIsLoading] = useState(true);
    const [auctionHistory, setAuctionHistory] = useState([]);

    useEffect(() => {
        fetch('/api/auctions/history')
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 오류');
                }
                return response.json();
            })
            .then(data => {
                setAuctionHistory(data);
                setIsLoading(false);

                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }
            })
            .catch(error => {
                console.error("경매 이력 불러오기 실패:", error);
                setIsLoading(false);
            });
    }, []);


    // 로딩 중일 때
    if (isLoading) {
        return <Loader/>;
    }

    // 데이터 렌더링
    return (
        <div className="bidHistory-container">
            <h3 className="bidHistory-title">경매 이력</h3>

            {auctionHistory.map((auction, index) => {
                const status = auction.status;

                return (
                    <div
                        key={index}
                        className="history-card"
                        style={{cursor: 'pointer'}}
                        onClick={() => window.location.href = `/auctionDetail.do?auctionId=${auction.auctionId}`}
                    >
                        <div className="card-header">
                            <div className="left-section">
                                <span className="round-number">{auction.auctionId}회차</span>
                                <div className="bid-title">경매 제목: {auction.title}</div>
                            </div>
                            <div className="right-section">
                                <div className="date">진행일자: {auction.startTime?.slice(0, 10)}</div>
                                <div
                                    className={`status ${status === '진행예정' ? 'upcoming' : status === '진행중' ? 'ongoing' : 'ended'}`}>
                                    {status}
                                </div>
                            </div>
                        </div>
                        <div className="tags">
                            {auction.tags?.map((tag, idx) => (
                                <span key={idx}>{tag}</span>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div className="prev-btn-wrap">
                <button className="prev-btn" onClick={() => window.location.href = './myPage.do'}>이전</button>
            </div>
        </div>
    );
}
