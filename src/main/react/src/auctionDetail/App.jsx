import './auctionDetail.css'
import React, {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

//auctionId추출
function getAuctionIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("auctionId");
}


export default function App() {

    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);
    const [auctionData, setAuctionData] = useState(null);

    useEffect(() => {
        // 예: 1초 후에 로딩 끝난 걸로 처리
        const timer = setTimeout(() => {
            setIsLoading(false)

            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500); // CSS transition과 동일 시간
            }

        }, 500);
        return () => clearTimeout(timer);
    }, []);

    //경매장 상세 데이터
    useEffect(() => {
        const auctionId = getAuctionIdFromQuery();
        if (auctionId) {
            fetch(`/api/auctions/auctionDetail/${auctionId}`)
                .then(res => res.json())
                .then(data => setAuctionData(data))
                .catch(err => console.error("불러오기 실패:", err));
        }
    }, []);

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    function handleBid(prodId) {
        // 실제로는 API 호출 필요
        // 예시: fetch(`/api/auctions/bid`, {method: 'POST', body: ...})
        // 성공 시 auctionData 상태 업데이트
        // 여기선 간단히 상태를 직접 변경하는 예시
        setAuctionData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.prodId === prodId
                    ? { ...item, winner: "현재유저", price: 10000 } // 예시값
                    : item
            )
        }));
    }

    const auctionStatus = auctionData.status;

    return (
        <div className="auction-wrapper">
            <div className="header">
                <h2 className="auction-title">{auctionData.title}</h2>
                <div className={`auction-status auction-status-${auctionStatus}`}>{auctionStatus}</div>
            </div>


            <div className="auction-info">
                <div className="auction-summary">
                    <span className="auction-session">{auctionData.auctionId}회차</span>
                    <div className="tags">
                        {auctionData.tags && auctionData.tags.map((tag, idx) => (
                            <span key={idx}>{tag}</span>
                        ))}
                    </div>
                </div>
                <p className="auctioneer">경매사:{auctionData.auctioneer}</p>
                <div className="auction-details">
                    <div>진행일자: {auctionData.startTime.slice(0, 10)}</div>
                    <div>
                        낙찰물품수: {
                        auctionData.items
                            ? auctionData.items.filter(item => item.winner).length
                            : 0
                    }
                    </div>
                </div>
            </div>

            <table className="auction-table">
                <thead>
                <tr>
                    <th>물품번호</th>
                    <th>물품명</th>
                    <th>이미지</th>
                    <th>낙찰가</th>
                    <th>낙찰자</th>
                </tr>
                </thead>
                <tbody>
                {auctionData.items.map((item) => {
                    let priceCell = "";
                    let winnerCell = "";

                    if (auctionStatus === "진행예정") {
                        // 예정: 빈칸
                        priceCell = "";
                        winnerCell = "";
                    } else if (auctionStatus === "진행중") {
                        if (item.winner && item.price) {
                            // 이미 낙찰됨
                            priceCell = item.price.toLocaleString() + "원";
                            winnerCell = item.winner;
                        } else if (item.isFailed) {
                            // 유찰
                            priceCell = "유찰";
                            winnerCell = "유찰";
                        } else {
                            // 낙찰 전

                            priceCell = "-";
                            winnerCell = "진행중"

                        }
                    } else if (auctionStatus === "종료") {
                        if (item.winner && item.price) {
                            priceCell = item.price.toLocaleString() + "원";
                            winnerCell = item.winner;
                        } else {
                            priceCell = "유찰";
                            winnerCell = "유찰";
                        }
                    }

                    return (
                        <tr key={item.prodId}>
                            <td>{item.prodId}번</td>
                            <td>{item.prodName}</td>
                            <td>
                                <img className="item-image" src={item.image} alt={item.prodName} />
                            </td>
                            <td>{priceCell}</td>
                            <td>{winnerCell}</td>
                        </tr>
                    );
                })}
                </tbody>


            </table>

            <button className="bidHistory-btn" onClick={()=> window.location.href='/bidHistory.do'}>목록</button>
        </div>
    );
}
