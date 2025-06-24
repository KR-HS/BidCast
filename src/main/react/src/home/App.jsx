import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import Calendar from "../calendar/calendar";
import RegAuction from "../regauction/App";
import Loader from "../Loader/Loader";
import { TbCalendarTime, TbCalendarPause, TbCalendarX } from "react-icons/tb";
import { RiMenuSearchLine } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";


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
    const [showRegAuction, setShowRegAuction] = useState(false); //경매장등록
    const [user, setUser] = useState(null);

    const [notices, setNotices] = useState([]);
    const [noticeIdx, setNoticeIdx] = useState(0);

    const [showMenu, setShowMenu] = useState(false); // 메뉴 토글 상태

    // 공지사항 목록을 DB에서 fetch
    useEffect(() => {
        fetch('/api/notices') // 공지사항을 반환하는 엔드포인트 필요
            .then(res => res.json())
            .then(data => setNotices(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        if (notices.length === 0) return;
        const timer = setInterval(() => {
            setNoticeIdx(prev => (prev + 1) % notices.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [notices]);

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

    // App.jsx 최상단

    // const scrollYRef = useRef(0);
    //
    // // useEffect 내부
    // useEffect(() => {
    //     if (showRegAuction) {
    //         // 스크롤 고정
    //         document.body.style.position = 'fixed';
    //         document.body.style.top = `-${scrollYRef.current}px`;
    //         document.body.style.left = '0';
    //         document.body.style.right = '0';
    //         document.body.style.overflowY = 'scroll'; // 스크롤바 유지
    //     } else {
    //         // 고정 해제 및 스크롤 위치 복원
    //         const scrollY = scrollYRef.current;
    //         document.body.style.position = '';
    //         document.body.style.top = '';
    //         document.body.style.left = '';
    //         document.body.style.right = '';
    //         document.body.style.overflowY = '';
    //         window.scrollTo(0, scrollY);
    //     }
    //
    //     return () => {
    //         const scrollY = scrollYRef.current;
    //         document.body.style.position = '';
    //         document.body.style.top = '';
    //         document.body.style.left = '';
    //         document.body.style.right = '';
    //         document.body.style.overflowY = '';
    //         window.scrollTo(0, scrollY);
    //     };
    // }, [showRegAuction]);

    //이미지 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const hasInitialized = useRef(false);

    // 스크롤 버튼 위치
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

        const wrappedScroll = () => {
            // 처음엔 무조건 20px로 시작
            if (!hasInitialized.current) {
                hasInitialized.current = true;
                setBtnBottom(20);
                return;
            }
            handleScroll();
        };

        window.addEventListener('scroll', wrappedScroll);

        // 최초 실행은 지연
        const timer = setTimeout(() => {
            wrappedScroll();
        }, 100);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', wrappedScroll);
        };
    }, []);


    // 경매 데이터 불러오기
    useEffect(() => {
        fetch('/api/auctions/top6')
            .then(res => res.json())
            .then(data => setAuctions(Array.isArray(data) ? data : []))
            .catch(() => setAuctions([]));
    }, []);

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



    //세션 데이터
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`서버 오류: ${response.status}`);
                }

                const data = await response.json();
                console.log("사용자 정보:", data);
                setUser(data);
            } catch (error) {
                // console.error("사용자 정보 요청 실패:", error);
            }
        };
        fetchUserInfo();

    }, []);


    //세션 데이터
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`서버 오류: ${response.status}`);
                }

                const data = await response.json();
                console.log("사용자 정보:", data);
                setUser(data);
            } catch (error) {
                // console.error("사용자 정보 요청 실패:", error);
            }
        };
        fetchUserInfo();

    }, []);
    


    useEffect(() => {


    }, [user]);


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

    const handleMyPageClick = () => {
        if (user === null) {
            window.location.href = "login.do";
        } else {
            window.location.href = "myPage.do";
        }
    };

    //로그아웃
    const logoutHandler = async () => {
        localStorage.removeItem('com.naver.nid.oauth.state_token');
        localStorage.removeItem('com.naver.nid.access_token');

        const response = await fetch("/logout", {
            method: "POST",
            credentials: "include", // 쿠키 전달
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });



        if (response.redirected) {
            window.location.href = response.url;
        } else {
            window.location.href = "/home.do"; // 또는 원하는 경로
        }
    };

    // 메뉴 리스트
    const toggleMenu = () => {
        setShowMenu(prev => !prev);
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
            {/*{showRegAuction && (*/}
            {/*    <>*/}
            {/*        <div*/}
            {/*            className="modal-backdrop"*/}
            {/*            onClick={() => setShowRegAuction(false)}*/}
            {/*        />*/}
            {/*        <div className="modal-container">*/}
            {/*            <div*/}
            {/*                className="modal"*/}
            {/*                onClick={(e) => e.stopPropagation()}*/}
            {/*            >*/}
            {/*                <RegAuction onClose={() => setShowRegAuction(false)} />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

            <div className="top-section">
                <img
                    src={images[current]}
                    alt={`슬라이드${current + 1}`}
                    className="slide-image"
                />
                <div className="action-buttons">
                    <div className="main-actions">
                        <div className="action" onClick={()=>{window.location.href="./search.do"}}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                                alt="경매검색"
                                className="action-icon"
                            />
                            <div className="action-label">경매검색</div>
                        </div>
                        <div className="action" onClick={()=>{window.location.href="./schedule.do"}}>

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                                alt="경매일정"
                                className="action-icon"
                            />
                            <div className="action-label">경매일정</div>
                        </div>
                    </div>
                    <div className="login-section">
                        {/*로그인이 여부 확인*/}
                        {user === null?(
                            <>
                                <button className="btn login" onClick={()=> {window.location.href="login.do"}}>로그인</button>
                                <div className="signup-row">
                                    {/*<span className="my-page" onClick={handleMyPageClick}>마이페이지</span>*/}
                                    <span className="signup-link" onClick={()=> {window.location.href="join.do"}}>회원가입</span>
                                </div>
                                <div className="login-desc">
                                    지금 로그인하세요!<br />
                                    경매를 실시간으로 즐길 수 있습니다<span role="img" aria-label="smile">😊</span>
                                </div>
                            </>
                        ):(
                            <>
                                <div className="welcome-message">
                                    <h2>{user.nickName}님 환영합니다!</h2>
                                </div>
                                <div className="logout-wrap">
                                    <span className="my-page" onClick={handleMyPageClick}>마이페이지</span>
                                    <span className="signup-link" onClick={logoutHandler}>로그아웃</span>
                                </div>
                                <div className="login-desc">
                                    이제 경매를 즐길 시간이에요!<br />
                                    {user.nickName}님,  지금 바로 둘러보세요. <span role="img" aria-label="smile">🔍</span>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>


            <div className="notice">
                <span role="img" aria-label="notice">📢</span>
                &nbsp;
                {notices.length > 0
                    ? notices[noticeIdx].title // 공지사항 내용 컬럼명에 맞게 수정
                    : "공지사항이 없습니다."}
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
                                            <a href={`/bidGuest.do?roomId=${item.auctionId}`}>
                                            <div className="auction-item" key={item.auctionId || idx}>
                                                <div className="auction-icon">
                                                    {getStatusImage(status)}
                                                </div>
                                                <div className="auction-info">
                                                    <div className="auction-title">{item.title}</div>
                                                    <div className="auction-time">{formatTime(item.startTime)}</div>
                                                </div>
                                            </div>
                                            </a>
                                        );
                                    })}
                                </div>
                                <div className="auction-column">
                                    {rightColumn.map((item, idx) => {
                                        const status = getAuctionStatus(item.startTime, item.endTime);
                                        return (
                                            <a href={`/bidGuest.do?roomId=${item.auctionId}`}>
                                            <div className="auction-item" key={item.auctionId || idx}>
                                                <div className="auction-icon">
                                                    {getStatusImage(status)}
                                                </div>
                                                <div className="auction-info">
                                                    <div className="auction-title">{item.title}</div>
                                                    <div className="auction-time">{formatTime(item.startTime)}</div>
                                                </div>
                                            </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!showRegAuction &&(
                <button className="floating-btn" style={{ bottom: `${btnBottom}px` }}
                        // onClick={regAuc}
                        onClick={toggleMenu}
                >
                    <img src="./img/hamburger.png" alt="메뉴" className="floating-icon" width='35px' />
                </button>
            )}
            {showMenu && (
                <div className="floating-menu">

                    <div className="menu-item" onClick={() => window.location.href = "/regAuction.do"}>
                        <h5>경매 등록</h5>
                        <div className="wrap-btn">
                            <RiAuctionLine size={30} />
                        </div>
                    </div>
                    <div className="menu-item" onClick={() => window.location.href = "/schedule.do"}>
                        <h5>경매 일정</h5>
                        <div className="wrap-btn">
                            <MdOutlineCalendarMonth size={30} />
                        </div>
                    </div>
                    <div className="menu-item" onClick={() => window.location.href = "/search.do"}>
                        <h5>경매 검색</h5>
                        <div className="wrap-btn">
                            <RiMenuSearchLine size={30} />
                        </div>
                    </div>
                </div>
            )}
        </div>

    )

}
