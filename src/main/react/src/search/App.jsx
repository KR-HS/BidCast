import React, { useEffect, useState } from 'react';
import './search.css';
import Loader from "../Loader/Loader";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function AuctionSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const [auctionList, setAuctionList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // 입력용 상태 (폼 입력값)
    const [inputStatus, setInputStatus] = useState('');
    const [inputTitle, setInputTitle] = useState('');

    // 실제 검색 쿼리 상태
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    const [likedMap, setLikedMap] = useState({});

    const size = 12;

    // 상태 우선순위 정의 (낮을수록 먼저 나옴)
    const statusPriority = {
        '진행중': 1,
        '진행예정': 2,
        '예정': 2,
        '종료': 3,
        '알 수 없음': 99
    };

    // 상태명 정규화 함수
    const normalizeStatus = (status) => {
        if (!status) return '알 수 없음';
        const s = status.replace(/\s/g, '').toLowerCase();
        if (s.includes('scheduled') || s.includes('진행예정')) return '진행예정';
        if (s.includes('live') || s.includes('진행중')) return '진행중';
        if (s.includes('end') || s.includes('종료') || s.includes('마감')) return '종료';
        return status;
    };

    // 상태 라벨
    const getStatusLabel = (status) => {
        const norm = normalizeStatus(status);
        if (norm === '진행중') return '진행중';
        if (norm === '진행예정') return '진행예정';
        if (norm === '종료') return '종료';
        if (norm === '예정') return '예정';
        return '알 수 없음';
    };

    // 상태 클래스명
    const getStatusClass = (status) => {
        const norm = normalizeStatus(status);
        if (norm === '진행중') return 'live';
        if (norm === '진행예정') return 'scheduled';
        if (norm === '종료') return 'ended';
        return 'unknown';
    };

    // 로그인 사용자 정보 가져오기
    useEffect(() => {
        fetch('/api/v1/getUserInfo', {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('로그인 필요');
                return res.json();
            })
            .then(data => {
                setCurrentUser(data);
            })
            .catch(() => {
                setCurrentUser(null);
            });
    }, []);

    // 경매 리스트 불러오기
    const fetchAuctions = async (pageNum = 0, status = '', title = '') => {
        try {
            let url = `/api/auctions?page=${pageNum}&size=${size}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;
            if (title) url += `&title=${encodeURIComponent(title)}`;

            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error("경매 데이터를 불러오는 데 실패했습니다.");
            const data = await response.json();

            if (data.length < size) setHasMore(false);
            if (pageNum === 0) setAuctionList(data);
            else setAuctionList(prev => [...prev, ...data]);

            // 새로운 경매목록이 로드될 때 좋아요 상태 유지
            const newLikedMap = {};
            data.forEach(item => {
                newLikedMap[item.auctionId] = likedMap[item.auctionId] || false;
            });
            setLikedMap(prev => ({ ...prev, ...newLikedMap }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 500);
            }
        }
    };

    // 검색 쿼리 상태 변경 시 데이터 가져오기
    useEffect(() => {
        setIsLoading(true);
        setPage(0);
        setHasMore(true);
        fetchAuctions(0, searchStatus, searchTitle);
    }, [searchStatus, searchTitle]);

    // 검색 버튼 클릭 시 실제 검색 상태 업데이트
    const onSearchClick = () => {
        setSearchStatus(inputStatus);
        setSearchTitle(inputTitle);
    };

    // 필터 입력 상태 변경 핸들러
    const handleStatusChange = (e) => setInputStatus(e.target.value);
    const handleTitleChange = (e) => setInputTitle(e.target.value);

    // 더보기 버튼 클릭
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAuctions(nextPage, searchStatus, searchTitle);
    };

    // 카드 클릭시 페이지 이동
    const handleCardClick = (auction) => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }
        const isHost = currentUser.userKey === auction.hostId;
        const url = isHost
            ? `http://localhost:8888/bidHost.do?roomId=${auction.auctionId}`
            : `http://localhost:8888/bidGuest.do?roomId=${auction.auctionId}`;

        window.location.href = url;
    };

    // 좋아요 토글
    const handleLikeToggle = (auctionId) => {
        setLikedMap(prev => ({
            ...prev,
            [auctionId]: !prev[auctionId],
        }));
        // 서버 API 호출 추가 가능
    };

    if (isLoading) return <Loader />;

    // 상태 필터 적용 후 항상 우선순위대로 정렬
    const filteredList = auctionList
        .filter(item => {
            if (!searchStatus) return true;
            return normalizeStatus(item.status) === searchStatus;
        })
        .sort((a, b) => {
            return (statusPriority[normalizeStatus(a.status)] || 99) - (statusPriority[normalizeStatus(b.status)] || 99);
        });

    return (
        <section className="auction-search">
            <div className="search-header">
                <h2>경매검색</h2>
                <p>다양한 필터를 활용하여 원하는 라이브를 빠르게 찾아보세요</p>
                <div className="search-bar-row">
                    <input
                        className="search-input"
                        placeholder="제목 또는 호스트를 입력하세요"
                        value={inputTitle}
                        onChange={handleTitleChange}
                    />
                    <select className="search-select" value={inputStatus} onChange={handleStatusChange}>
                        <option value="">전체</option>
                        <option value="진행예정">진행예정</option>
                        <option value="진행중">진행중</option>
                        <option value="종료">종료</option>
                    </select>
                    <button className="search-btn" onClick={onSearchClick}>
                        검색
                    </button>
                </div>
            </div>

            <div className="card-list">
                {filteredList.length === 0 && (
                    <div className="empty-message">검색 결과가 없습니다.</div>
                )}
                {filteredList.map(item => {
                    const status = item.status;
                    const liked = likedMap[item.auctionId] || false;
                    return (
                        <div
                            className="card"
                            key={item.auctionId}
                            onClick={() => handleCardClick(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="thumbnail">
                                <img src={item.thumbnailUrl || '/img/thumbnail.png'} alt="썸네일" />
                                <span className={`cast-state status-${getStatusClass(status)}`}>
                                    {getStatusLabel(status)}
                                </span>
                                <button
                                    className={`like-btn${liked ? ' liked' : ''}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleLikeToggle(item.auctionId);
                                    }}
                                    aria-label={liked ? "좋아요 취소" : "좋아요"}
                                >
                                    {liked
                                        ? <FaHeart color="red" size={20} />
                                        : <FaRegHeart color="black" size={20} />
                                    }
                                </button>
                            </div>
                            <div className="info">
                                <h3>{item.title}</h3>
                                <div className="info-content">
                                    <div className="guest-count">참여자수: {item.guestCount || 0}</div>
                                    <div className="host-name">경매사: {item.hostName || '-'}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="load-more-container">
                    <button className="search-btn" onClick={loadMore}>더보기</button>
                </div>
            )}
        </section>
    );
}
