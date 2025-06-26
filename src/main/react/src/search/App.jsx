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

    const [inputStatus, setInputStatus] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    const [likedMap, setLikedMap] = useState({});
    const size = 12;

    const statusPriority = {
        '진행중': 1,
        '진행예정': 2,
        '예정': 2,
        '종료': 3,
        '알 수 없음': 99
    };

    const normalizeStatus = (status) => {
        if (!status) return '알 수 없음';
        const s = status.replace(/\s/g, '').toLowerCase();
        if (s.includes('scheduled') || s.includes('진행예정')) return '진행예정';
        if (s.includes('live') || s.includes('진행중')) return '진행중';
        if (s.includes('end') || s.includes('종료') || s.includes('마감')) return '종료';
        return status;
    };

    const getStatusLabel = (status) => {
        const norm = normalizeStatus(status);
        if (norm === '진행중') return '진행중';
        if (norm === '진행예정') return '진행예정';
        if (norm === '종료') return '종료';
        return '알 수 없음';
    };

    const getStatusClass = (status) => {
        const norm = normalizeStatus(status);
        if (norm === '진행중') return 'live';
        if (norm === '진행예정') return 'scheduled';
        if (norm === '종료') return 'ended';
        return 'unknown';
    };

    useEffect(() => {
        fetch('/api/v1/getUserInfo', {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error('로그인 필요');
                return res.json();
            })
            .then(data => setCurrentUser(data))
            .catch(() => setCurrentUser(null));
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        fetch(`/api/favorites/${currentUser.userKey}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                const map = {};
                data.forEach(item => {
                    map[item.auctionId] = true;
                });
                setLikedMap(map);
            })
            .catch(err => console.error('좋아요 목록 불러오기 실패:', err));
    }, [currentUser]);

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

    useEffect(() => {
        setIsLoading(true);
        setPage(0);
        setHasMore(true);
        fetchAuctions(0, searchStatus, searchTitle);
    }, [searchStatus, searchTitle]);

    const onSearchClick = () => {
        setSearchStatus(inputStatus);
        setSearchTitle(inputTitle);
    };

    const handleStatusChange = (e) => setInputStatus(e.target.value);
    const handleTitleChange = (e) => setInputTitle(e.target.value);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAuctions(nextPage, searchStatus, searchTitle);
    };

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

    const handleLikeToggle = async (auctionId) => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        const userKey = currentUser.userKey;
        const liked = likedMap[auctionId] || false;

        try {
            const method = liked ? 'DELETE' : 'POST';
            await fetch(`/api/favorites/like?userKey=${userKey}&aucKey=${auctionId}`, {
                method,
                credentials: 'include',
            });

            setLikedMap(prev => ({
                ...prev,
                [auctionId]: !liked,
            }));
        } catch (err) {
            console.error("좋아요 상태 변경 실패:", err);
            alert("좋아요 변경 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) return <Loader />;

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
                    <button className="search-btn" onClick={onSearchClick}>검색</button>
                </div>
            </div>

            <div className="card-list">
                {filteredList.length === 0 && <div className="empty-message">검색 결과가 없습니다.</div>}
                {filteredList.map(item => {
                    const status = item.status;
                    const liked = likedMap[item.auctionId] || false;
                    return (
                        <div className="card" key={item.auctionId} onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                            <div className="thumbnail">
                                <img src={item.thumbnailUrl || '/img/thumbnail.png'} alt="썸네일" />
                                <span className={`cast-state status-${getStatusClass(status)}`}>{getStatusLabel(status)}</span>
                                <button
                                    className={`like-btn${liked ? ' liked' : ''}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleLikeToggle(item.auctionId);
                                    }}
                                    aria-label={liked ? "좋아요 취소" : "좋아요"}
                                >
                                    {liked ? <FaHeart color="red" size={20} /> : <FaRegHeart color="black" size={20} />}
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
