import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import Calendar from "../calendar/calendar";
import RegAuction from "../regauction/regauction";
import Loader from "../Loader/Loader";


const images = [
    '/img/slide1.png',
    '/img/slide2.png',
];

const today = new Date();

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

        }, 1000);
        return () => clearTimeout(timer);
    }, []);



    const [current, setCurrent] = useState(0);
    const [selectedDate, setSelectedDate] = useState(today);
    const [btnBottom, setBtnBottom] = useState(20); // 버튼 bottom 위치 상태 관리
    const [showRegAuction, setShowRegAuction] = useState(false); //경매장등록

// App.jsx 최상단
    const scrollYRef = useRef(0);

// useEffect 내부
    useEffect(() => {
        if (showRegAuction) {
            // 스크롤 고정
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflowY = 'scroll'; // 스크롤바 유지
        } else {
            // 고정 해제 및 스크롤 위치 복원
            const scrollY = scrollYRef.current;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflowY = '';
            window.scrollTo(0, scrollY);
        }

        return () => {
            const scrollY = scrollYRef.current;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflowY = '';
            window.scrollTo(0, scrollY);
        };
    }, [showRegAuction]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

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

    const formatDate = (date) =>
        `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    const isToday = (date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };



    //경매장 등록
    const regAuc = (e) => {
        scrollYRef.current = window.scrollY;
        setShowRegAuction(true);

    };
    const containerRef = useRef(null);
    const handleContainerClick = (e) => {
        // 클릭된 요소나 그 부모가 modal 클래스를 가진 요소가 아닐 경우에만 모달 닫기
        if (showRegAuction && containerRef.current && !e.target.closest('.modal')) {
            setShowRegAuction(false);
        }
    };



    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <div className="dashboard-container"
        ref={containerRef}
        onClick={handleContainerClick}>

            {/*경매장 등록버튼 클릭시 활성*/}
            {showRegAuction && (
                <>
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowRegAuction(false)}
                    />
                    <div className="modal-container">
                        <div
                            className="modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <RegAuction onClose={() => setShowRegAuction(false)} />
                        </div>
                    </div>
                </>
            )}

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
                    <h3>경매리스트</h3>
                    <ul>
                        <li>상품1</li>
                        <li>상품2</li>
                    </ul>
                </div>
            </div>
            {!showRegAuction &&(
                <button className="floating-btn" style={{ bottom: `${btnBottom}px` }}
                onClick={regAuc}
            >＋</button>
            )}
        </div>

    )
}
