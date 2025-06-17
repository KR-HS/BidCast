import React, { useEffect, useState } from 'react';
import './notice.css';
import Loader from "../Loader/Loader";

// 예시 데이터
const noticeData = [
    { id: 1, title: "경매 개장시간 안내", date: "2025.06.09", badge: "공지" },
    { id: 2, title: "서비스 점검 안내", date: "2025.06.08", badge: "공지" },
    { id: 3, title: "신규 기능 추가", date: "2025.06.07", badge: "공지" },
    { id: 4, title: "이벤트 안내", date: "2025.06.06", badge: "공지" },
    { id: 5, title: "업데이트 공지", date: "2025.06.05", badge: "공지" },
    { id: 6, title: "시스템 점검", date: "2025.06.04", badge: "공지" },
    { id: 7, title: "이용약관 변경", date: "2025.06.03", badge: "공지" },
    // ...더 추가 가능
];

export default function Notice() {
    // 로딩
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // 검색 및 페이지네이션 상태
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 필터링된 공지 목록
    const filteredNotices = noticeData
        .map((item, idx) => ({ ...item, idx }))
        .filter(notice => notice.title.toLowerCase().includes(search.toLowerCase()));

    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 이동
    const handleClickPage = pageNum => setCurrentPage(pageNum);
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    if (isLoading) return <Loader />;

    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>
                    BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!
                </p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inquiry.do">1:1문의</a>
                    <a href="notice.do" className="active">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="board-top">
                    <div className="total">총 {filteredNotices.length}건</div>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="검색어를 입력해주세요"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // 검색 시 1페이지로
                            }}
                        />
                        <button className="search-btn" aria-label="검색">
                            <img src="./img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {currentNotices.length === 0 ? (
                        <li style={{textAlign: 'center', padding: '2rem'}}>검색 결과가 없습니다.</li>
                    ) : (
                        currentNotices.map(notice => (
                            <li key={notice.id}>
                                <a href={`noticeDetail.do?id=${notice.id}`} style={{display: 'flex', width: '100%', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                                    <div className="num">{notice.id}</div>
                                    <div className="title">
                                        <span className="badge">{notice.badge}</span>
                                        {notice.title}
                                    </div>
                                    <div className="date">{notice.date}</div>
                                </a>
                            </li>
                        ))
                    )}
                </ul>
                <div className="pagination">
                    <button className="prev" onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <span
                            key={num}
                            className={num === currentPage ? 'active' : ''}
                            onClick={() => handleClickPage(num)}
                        >
                            {num}
                        </span>
                    ))}
                    <button className="next" onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                </div>
            </div>
        </div>
    );
}
