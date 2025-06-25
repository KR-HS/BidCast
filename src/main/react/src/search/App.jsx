import React, { useEffect, useState } from 'react';
import './search.css';
import Loader from "../Loader/Loader";

export default function AuctionSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const [auctionList, setAuctionList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [titleKeyword, setTitleKeyword] = useState('');
    const size = 12;

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
                console.log("✅ currentUser", data);
                setCurrentUser(data);
            })
            .catch(err => {
                console.error("❌ 사용자 정보 불러오기 실패:", err);
                setCurrentUser(null);
            });
    }, []);

    // 상태 텍스트 변환 함수
    const getStatusLabel = (status) => {
        if (!status) return '알 수 없음';

        const s = status.replace(/\s/g, '').toLowerCase(); // 공백 제거 후 소문자 처리

        if (s.includes('scheduled') || s.includes('예정') || s.includes('진행예정')) return '예정';
        if (s.includes('live') || s.includes('진행중')) return '진행중';
        if (s.includes('end') || s.includes('마감') || s.includes('종료')) return '종료';

        return '알 수 없음';
    };

    // 경매 리스트 불러오기 함수 (제목 + 상태 조건 포함)
    const fetchAuctions = async (pageNum = 0, status = '', title = '') => {
        try {
            let url = `/api/auctions?page=${pageNum}&size=${size}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;
            if (title) url += `&title=${encodeURIComponent(title)}`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error("경매 데이터를 불러오는 데 실패했습니다.");
            const data = await response.json();

            if (data.length < size) setHasMore(false);
            if (pageNum === 0) setAuctionList(data);
            else setAuctionList(prev => [...prev, ...data]);
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

    // 초기 로딩 (빈 필터로)
    useEffect(() => {
        fetchAuctions(0, statusFilter, titleKeyword);
    }, []);

    // 상태 필터 변경
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // 제목 검색어 변경
    const handleTitleChange = (e) => {
        setTitleKeyword(e.target.value);
    };

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        setPage(0);
        setHasMore(true);
        setIsLoading(true);
        fetchAuctions(0, statusFilter, titleKeyword);
    };

    // 더보기 클릭 시
    const loadMore = () => {
        const nextPage = page + 1;
        fetchAuctions(nextPage, statusFilter, titleKeyword);
        setPage(nextPage);
    };

    // 카드 클릭 시 호스트/게스트 구분 이동
    const handleCardClick = (auction) => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isHost = currentUser.userKey === auction.hostId;
        const url = isHost
            ? `http://localhost:8888/bidHost.do?roomid=${auction.auctionId}`
            : `http://localhost:8888/bidGuest.do?roomid=${auction.auctionId}`;

        window.location.href = url;
    };

    if (isLoading) return <Loader />;

    return (
        <section className="auction-search">
            <div className="search-header">
                <h2>경매검색</h2>
                <p>다양한 필터를 활용하여 원하는 라이브를 빠르게 찾아보세요</p>
                <div className="search-bar-row">
                    <input
                        className="search-input"
                        placeholder="제목 또는 호스트를 입력하세요"
                        value={titleKeyword}
                        onChange={handleTitleChange}
                    />
                    <select className="search-select" value={statusFilter} onChange={handleStatusChange}>
                        <option value="">전체</option>
                        <option value="예정">예정</option>
                        <option value="진행예정">진행예정</option>
                        <option value="진행중">진행중</option>
                        <option value="종료">종료</option>
                    </select>
                    <button className="search-btn" onClick={handleSearch}>검색</button>
                </div>
            </div>

            <div className="card-list">
                {auctionList.map(item => (
                    <div
                        className="card"
                        key={item.auctionId}
                        onClick={() => handleCardClick(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="thumbnail">
                            <img src={'/img/thumbnail.png'} alt="썸네일" />
                            <span className={`cast-state ${getStatusLabel(item.status)}`}>
                                {getStatusLabel(item.status)}
                            </span>
                        </div>
                        <div className="card-desc">
                            <div className="product-title">경매 제목: {item.title}</div>
                            <div className="time-info">
                                시작: {new Date(item.startTime).toLocaleString()}<br />
                                종료: {new Date(item.endTime).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="load-more-container">
                    <button className="search-btn" onClick={loadMore}>더보기</button>
                </div>
            )}
        </section>
    );
}
