import './bidHistory.css';
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

    return (
        <div className="bidHistory-container">
            <h3 className="bidHistory-title">경매 이력</h3>
            <div
                className="history-card"
                style={{ cursor: 'pointer' }} // 클릭 가능한 UI 개선
                onClick={()=> {window.location.href='./auctionDetail.do'}}
            >
                <div className="card-header">
                    <div className="left-section">
                        <span className="round-number">1회차</span>
                        <div className="bid-title">경매 제목: 오늘 엄청난 물건 나옵니다!!</div>
                    </div>
                    <div className="right-section">
                        <div className="date">진행일자: 2025.06.10</div>
                        <div className="status upcoming">진행예정</div>
                    </div>
                </div>
                <div className="category-tags">
                    <span>가전제품</span>
                    <span>생활용품</span>
                </div>
            </div>

            <img src="/img/home.png" alt="마이페이지" className="myPage-btn" onClick={ ()=>{window.location.href="./myPage.do"}}/>
        </div>
    );
}
