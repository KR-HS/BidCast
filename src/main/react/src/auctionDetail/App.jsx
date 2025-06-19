import './auctionDetail.css'
import React, {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

//auctionId추출
function getAuctionIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("auctionId");

}

//경매 상태 계산
function getAuctionStatus(startTime, endTime){
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if(now < start) return "예정";
    if(now >= start && now <= end) return "진행중";
    return "종료";
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

    const auctionStatus = getAuctionStatus(auctionData.startTime,auctionData.endTime);

    return (
        <div className="auction-wrapper">
            <div className="header">
                <h2 className="auction-title">{auctionData.title}</h2>
                <div className={`auction-status auction-status-${auctionStatus}`}>{auctionStatus}</div>
            </div>


            <div className="auction-info">
                <div className="auction-summary">
                    <span className="auction-session">{auctionData.session}회차</span>
                    <div className="tags">
                        {auctionData.tags && auctionData.tags.map((tag, idx) => (
                            <span key={idx}>{tag}</span>
                        ))}
                    </div>
                </div>
                <p className="auctioneer">경매사:{auctionData.auctioneer}</p>
                <div className="auction-details">
                    <div>진행일자: {auctionData.date}</div>
                    <div>낙찰물품수:{auctionData.itemCount} </div>
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
                {/*{auctionData.items.map((item) => (*/}
                {/*    <tr key={item.id}>*/}
                {/*        <td>{item.id}번</td>*/}
                {/*        <td>{item.name}</td>*/}
                {/*        <td>*/}
                {/*            <img*/}
                {/*                className="item-image"*/}
                {/*                src={item.image}*/}
                {/*                alt={item.name}*/}
                {/*            />*/}
                {/*        </td>*/}
                {/*        <td></td>*/}
                {/*        <td></td>*/}
                {/*    </tr>*/}
                {/*))}*/}
                </tbody>
            </table>

            <button className="bidHistory-btn" onClick={()=> window.location.href='./bidHistory.do'}>목록</button>
        </div>
    );
}
