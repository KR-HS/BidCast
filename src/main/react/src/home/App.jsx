import React, {useEffect, useState} from 'react'
import './App.css'
import Calendar from "../calendar/calendar";
import Loader from "../Loader/Loader";
import { TbCalendarTime, TbCalendarPause, TbCalendarX } from "react-icons/tb";


const images = [
    '/img/slide1.png',
    '/img/slide2.png',
];

const today = new Date();

export default function App() {

    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    //경매리스트 불러옴
    const [auctions, setAuctions] = useState([]);

    const [current, setCurrent] = useState(0);
    const [selectedDate, setSelectedDate] = useState(today);
    const [btnBottom, setBtnBottom] = useState(20); // 버튼 bottom 위치 상태 관리

    // 날짜 포맷: "YYYY-MM-DD"
    const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // 시간 포맷: "08:00"
    const formatTime = (isoString) => {
        if (!isoString) return "";
        // "2025-06-16T08:30:00" → "08:30:00"
        const timePart = isoString.split("T")[1];
        if (!timePart) return "";
        const [hourStr, minute] = timePart.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour < 12 ? "오전" : "오후";
        let hour12 = hour % 12;
        if (hour12 === 0) hour12 = 12;
        return `${ampm} ${hour12}:${minute}`;
    };


    // 경매 상태 판단
    const getAuctionStatus = (startTimeStr, endTimeStr) => {
        const now = new Date();
        const start = startTimeStr ? new Date(startTimeStr) : null;
        const end = endTimeStr ? new Date(endTimeStr) : null;
        if (start && end && now >= start && now <= end) return "진행중";
        if (end && now > end) return "종료";
        if (start && now < start) return "예정";
        return "예정";
    };

    // 상태별 아이콘
    const getStatusImage = (status) => {
        switch (status) {
            case "예정":
                return <TbCalendarTime size={25}/>;
            case "진행중":
                return <TbCalendarPause size={25}/>;
            case "종료":
                return <TbCalendarX size={25}/>;
            default:
                return null;
        }
    };


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

        }, 1000);
        return () => clearTimeout(timer);
    }, []);


    //이미지 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    //스크롤 버튼 위치
    useEffect(() => {
        function handleScroll() {
            const footer = document.querySelector('footer'); // 실제 푸터 선택자에 맞게 수정
            if (!footer) return;

            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (footerRect.top < windowHeight) {
                const overlap = windowHeight - footerRect.top;
                setBtnBottom(overlap + 20);
            } else {
                setBtnBottom(20);
            }
        }

        window.addEventListener('scroll', handleScroll);
        // 초기 한 번 실행
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    //경매 데이터 불러오기
    useEffect(() => {
        fetch('/api/auctions/top5')
            .then(res => res.json())
            .then(data => setAuctions(Array.isArray(data) ? data : []))
            .catch(() => setAuctions([]));
    }, []);

    //날짜 비교
    const isToday = (date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // 선택한 날짜에 해당하는 경매만 필터링
    const selectedDateStr = formatDate(selectedDate); // "YYYY-MM-DD"
    const filteredAuctions = auctions.filter(item =>
        item.startTime && item.startTime.startsWith(selectedDateStr)
    );

    // 2단 분할 (최대 6개만)
    const visibleAuctions = filteredAuctions.slice(0, 6);
    const leftColumn = visibleAuctions.filter((_, idx) => idx % 2 === 0);
    const rightColumn = visibleAuctions.filter((_, idx) => idx % 2 === 1);

    if (isLoading) {
        return (
            <Loader/>
        );
    }



    return (
        <div className="dashboard-container">
            <div className="top-section">
                <img
                    src={images[current]}
                    alt={`슬라이드${current + 1}`}
                    className="slide-image"
                />
                <div className="action-buttons">
                    <div className="main-actions">
                        <div className="action">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                                alt="경매검색"
                                className="action-icon"
                                onClick={()=>{window.location.href="#"}}
                            />
                            <div className="action-label">경매검색</div>
                        </div>
                        <div className="action">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                                alt="경매일정"
                                className="action-icon"
                                onClick={()=>{window.location.href="./schedule.do"}}
                            />
                            <div className="action-label">경매일정</div>
                        </div>
                    </div>
                    <div className="login-section">
                        <div className="my-page">마이페이지</div>
                        <button className="btn login" onClick={()=> {window.location.href="login.do"}}>로그인</button>
                        <div className="signup-row">
                            <span className="signup-link" onClick={()=> {window.location.href="join.do"}}>회원가입</span>
                        </div>
                        <div className="login-desc">
                            지금 로그인하세요!<br />
                            경매를 실시간으로 즐길 수 있습니다<span role="img" aria-label="smile">😊</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="notice">
                <span role="img" aria-label="notice">📢</span>
                &nbsp;경매 시작은 항상 오전 9시에 오픈됩니다. 일정 없이 변동될 수 있습니다.
            </div>

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
                        <span className="auction-dropdown" onClick={()=>{window.location.href="./schedule.do"}}>경매일정 전체보기 &gt;</span>
                    </div>
                    <div className="auction-two-column-list">
                        {filteredAuctions.length === 0 ? (
                            <div className="no-auction">등록된 경매가 없습니다</div>
                        ) : (
                            <>
                                <div className="auction-column">
                                    {leftColumn.map((item, idx) => {
                                        const status = getAuctionStatus(item.startTime, item.endTime);
                                        return (
                                            <div className="auction-item" key={item.auctionId || idx}>
                                                <div className="auction-icon">
                                                    {getStatusImage(status)}
                                                </div>
                                                <div className="auction-info">
                                                    <div className="auction-title">{item.title}</div>
                                                    <div className="auction-time">{formatTime(item.startTime)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="auction-column">
                                    {rightColumn.map((item, idx) => {
                                        const status = getAuctionStatus(item.startTime, item.endTime);
                                        return (
                                            <div className="auction-item" key={item.auctionId || idx}>
                                                <div className="auction-icon">
                                                    {getStatusImage(status)}
                                                </div>
                                                <div className="auction-info">
                                                    <div className="auction-title">{item.title}</div>
                                                    <div className="auction-time">{formatTime(item.startTime)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <button className="floating-btn" style={{ bottom: `${btnBottom}px` }}>＋</button>
        </div>

    )
}
