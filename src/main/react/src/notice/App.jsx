import React, { useEffect, useState } from 'react';
import './notice.css';
import Loader from "../Loader/Loader";

export default function Notice() {
    const [isLoading, setIsLoading] = useState(true);
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch('/api/notices')
                .then(res => res.json())
                .then(data => {
                    setNotices(data);
                    setIsLoading(false);

                    const loader = document.getElementById('loader');
                    if (loader) {
                        loader.classList.add('fade-out');
                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 500);
                    }
                })
                .catch(err => {
                    console.error('공지사항 로딩 실패', err);
                    setIsLoading(false);
                });
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

    const handleClickPage = (pageNum) => setCurrentPage(pageNum);
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    if (isLoading) return <Loader />;

    return (
        <div className="box">
            <div className="head">
                <h3>고객센터</h3>
                <p>
                    BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!
                </p>
                <div className="nav">
                    <a href="/faq.do" className="faq">FAQ</a>
                    <a href="/inquiry.do">1:1문의</a>
                    <a href="/notice.do" className="active">공지사항</a>
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
                                setCurrentPage(1);
                            }}
                        />
                        <button className="search-btn" aria-label="검색">
                            <img src="/img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {currentNotices.length === 0 ? (
                        <li className="no-result">검색 결과가 없습니다.</li>
                    ) : (
                        currentNotices.map(notice => (
                            <li
                                key={notice.noticeKey}
                                className="notice-link"
                                onClick={() => window.location.href = `/noticeDetail.do?id=${notice.noticeKey}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="num">{notice.noticeKey}</div>
                                <div className="title-head">
                                    <span className="badge">공지</span>
                                    <div className="title">{notice.title}</div>
                                </div>
                                <div className="date">
                                    {notice.regDate
                                        ? new Date(notice.regDate.replace(' ', 'T')).toISOString().slice(0, 10).replace(/-/g, '.')
                                        : '날짜 없음'}
                                </div>
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
