import React, {useEffect, useRef, useState} from "react";
import {RiAuctionLine, RiMenuSearchLine} from "react-icons/ri";
import {MdOutlineCalendarMonth} from "react-icons/md";

const MenuBtn = () => {

    // 버튼 위치 조정
    const [btnBottom, setBtnBottom] = useState(20);

    // 메뉴 토글
    const [showMenu, setShowMenu] = useState(false);

    // 첫화면시 버튼위치 조정을 위해 필요
    const hasInitialized = useRef(false);

    // 스크롤 버튼 위치
    useEffect(() => {
        function handleScroll() {
            const footer = document.querySelector('footer');
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


    // 메뉴 리스트
    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };


    return (
        <>
            <div className="floating-btn-wrap" style={{bottom: `${btnBottom}px`}}>
                <button className="floating-btn" onClick={toggleMenu}>
                    <img src="/img/hamburger.png" alt="메뉴" className="floating-icon" width='35px'/>
                </button>
                {showMenu && (
                    <div className="floating-menu">
                        <div className="menu-item" onClick={() => window.location.href = "/regAuction.do"}>
                            <h5>경매 등록</h5>
                            <div className="wrap-btn">
                                <RiAuctionLine size={30}/>
                            </div>
                        </div>
                        <div className="menu-item" onClick={() => window.location.href = "/schedule.do"}>
                            <h5>경매 일정</h5>
                            <div className="wrap-btn">
                                <MdOutlineCalendarMonth size={30}/>
                            </div>
                        </div>
                        <div className="menu-item" onClick={() => window.location.href = "/search.do"}>
                            <h5>경매 검색</h5>
                            <div className="wrap-btn">
                                <RiMenuSearchLine size={30}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MenuBtn;