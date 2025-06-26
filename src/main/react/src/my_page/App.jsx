import React, {useEffect, useState} from 'react'
import './myPage.css'
import Loader from "../Loader/Loader";


export default function myPage() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [winningItems, setWinningItems] = useState([]);

    // URL에서 쿼리 파라미터 읽기
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || '경매이력';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        // 주소창에서 쿼리 제거 (페이지 새로고침 없이 주소만 변경)
        if (initialTab) {
            const urlWithoutQuery = window.location.pathname;
            window.history.replaceState(null, '', urlWithoutQuery);
        }
    }, [initialTab]);

    const [favoriteItems, setFavoriteItems] = useState([]);
    const [userKey, setUserKey] = useState(null);

    const [isSocial, setIsSocial] = useState(false);

    const handleClick = (auctionId) =>{
        window.location.href = `/auctionDetail.do?auctionId=${auctionId}`;
    }

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


    // 경매이력
    useEffect(() => {
        fetch('/api/auctions/history')
            .then(res => {
                if (res.status === 401) {
                    // 세션 만료 또는 인증 실패 → 로그인 페이지로 이동
                    window.location.href = '/login.do';
                    return;
                }
                return res.json();
            })
            .then(data => {
                console.log('경매이력 items data:', data, Array.isArray(data));
                // console.log("서버응답 data 확인:" + data);
                if (data) {
                    setItems(data);
                }
            })
            .catch(err => {
                console.error('요청 실패:', err);
            });
    }, []);


    useEffect(() => {
        if(activeTab === '낙찰내역') {
            fetch('/api/auctions/winning-history')
                .then(res => {
                    if (res.status === 401) {
                        window.location.href = '/login.do';
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('낙찰 items data:', data, Array.isArray(data));
                    if (data) setWinningItems(data);
                })
                .catch(err => {
                    console.log('낙찰내역 요청 실패:',err);
                });
        }
    }, [activeTab, userKey]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) return;
                const data = await res.json();

                setIsSocial(data.loginId.includes("socialId_"));
                setUserKey(data.userKey); // userKey 상태 저장
            } catch (err) {
                console.error("유저 정보 가져오기 실패:", err);
            }
        };
        fetchUserInfo();
    }, []);


    useEffect(() => {
        if (activeTab === '관심경매') {
            fetch(`/api/favorites/list/${userKey}`)
                .then(res => {
                    if (res.status === 401) {
                        window.location.href = '/login.do';
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('관심경매 items data:', data, Array.isArray(data));
                    if (data) setFavoriteItems(data);
                })
                .catch(err => {
                    console.error('관심경매 요청 실패:', err);
                });
        }
    }, [activeTab, userKey]);




    if (isLoading) {
        return (
            <Loader/>
        );
    }


    return (
        <div className="my-page-container">
            <div className="header">
                <div className="header-title">마이페이지</div>
                <div className="header-desc">경매를 똑똑하게 즐기기, BidCast</div>
                {!isSocial && (
                <nav className="nav-menu">
                    {['경매이력', '낙찰내역', '문의', '내 정보수정','관심경매'].map((tab) => (
                        <button
                            key={tab}
                            className={`nav-item ${activeTab === tab ? 'nav-item-active' : ''}`}
                            onClick={() => {
                            if (tab === '문의') {
                                window.location.href = '/inquiryList.do';
                            } else if (tab === '내 정보수정') {
                                window.location.href = '/pwCheck.do';
                            } else {
                                setActiveTab(tab);
                            }
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                )}
                {isSocial && (
                    <nav className="nav-menu">
                        {['경매이력', '낙찰내역', '문의', '닉네임 변경','관심경매'].map((tab) => (
                            <button
                                key={tab}
                                className={`nav-item ${activeTab === tab ? 'nav-item-active' : ''}`}
                                onClick={() => {
                                    if (tab === '문의') {
                                        window.location.href = '/inquiryList.do';
                                    } else if (tab === '닉네임 변경') {
                                        window.location.href = '/memberModify.do';
                                    } else {
                                        setActiveTab(tab);
                                    }
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                )}
            </div>

            {activeTab === '경매이력' && (
                <>
                    <div className="content-box">
                        <div className="section-title">경매이력
                            <button className="all-btn" onClick={() => window.location.href = '/bidHistory.do'}>
                                전체 보기
                            </button>
                        </div>
                    <div className="item-list">
                        {items.map(item => (
                            <div className="item-card" key={item.id} onClick={()=>handleClick(item.auctionId)} >
                                <img src={item.image} alt={item.title} className="item-img" />
                                <div className="item-title">{item.title}</div>
                            </div>
                        ))}
                    </div>
                    </div>
                </>
            )}

            {activeTab === '낙찰내역' && (
                <>
                    <div className="content-box">
                    <div className="section-title">낙찰내역</div>
                    <div className="item-list scrollable-list">
                        {winningItems.length === 0 && (
                            <div className="empty-message">아직 낙찰받은 상품이 없습니다.</div>
                        )}
                        {winningItems.map(item => (
                            <div className="item-card" key={item.prodId}>
                                <img src={item.image} alt={item.prodName} className="item-img" />
                                <div className="item-title">{item.prodName}</div>
                                <div className="item-price">
                                    <div className="item-price">낙찰가:{item.price.toLocaleString() + "원"}
                                        </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </>
            )}

            {activeTab === '관심경매' && (
                <>
                    <div className="content-box">
                        <div className="section-title">관심경매</div>
                        <div className="item-list">
                            {favoriteItems.length === 0 && (
                                <div className="empty-message">아직 등록한 관심경매가 없습니다.</div>
                            )}
                            {favoriteItems.map(item => (
                                <a
                                    href={`/bidGuest.do?roomId=${item.auctionId}`}
                                    key={item.auctionId}
                                    className="item-card"
                                    style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                >
                                    <img src={item.image} alt={item.title} className="item-img" />
                                    <div className="item-title">{item.title}</div>
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}


        </div>


    );
}