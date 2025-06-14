import './auctionDetail.css'
import React, {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

export default function App() {

    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    const auctionData = {
        session: "1183회차 경매",
        auctioneer: "김형섭",
        date: "2025-06-03",
        itemCount: 2,
        maxViewers: 20,
        items: [
            {
                id: 11021,
                name: "모자",
                image: "img/img2.jpeg",
                price: "111,000원",
                winner: "형섭핑",
            },
            {
                id: 11023,
                name: "모자",
                image: "img/img2.jpeg",
                price: "1,111,000원",
                winner: "형섭핑",
            },
        ],
    };

    return (
        <div className="auction-wrapper">
            <div className="header">
                <h2 className="auction-title">들어오세요</h2>
                <button className="auction-end-button">종료</button>
            </div>


            <div className="auction-info">
                <div className="auction-summary">
                    <span className="auction-session">{auctionData.session}</span>
                    <span className="auctioneer">경매사: {auctionData.auctioneer}</span>
                </div>
                <div className="auction-details">
                    <div>진행일자: {auctionData.date}</div>
                    <div>낙찰물품수: {auctionData.itemCount}</div>
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
                {auctionData.items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}번</td>
                        <td>{item.name}</td>
                        <td>
                            <img
                                className="item-image"
                                src={item.image}
                                alt={item.name}
                            />
                        </td>
                        <td>{item.price}</td>
                        <td>{item.winner}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="bidHistory-btn" onClick={()=> window.location.href='./bidHistory.do'}>목록</button>
        </div>
    );
}
