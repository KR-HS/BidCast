import React, { useState } from 'react';
import './inquiryList.css';

const inquiryData = [
    { id: 1, title: '경매 입찰 방법이 궁금합니다', status: '답변완료', date: '2025-06-01' },
    { id: 2, title: '계정 정보 변경 안내', status: '답변대기', date: '2025-06-05' },
    { id: 3, title: '결제 오류 문의', status: '답변완료', date: '2025-06-10' },
    { id: 4, title: '문의 제목 예시 1', status: '답변대기', date: '2025-06-11' },
    { id: 5, title: '문의 제목 예시 2', status: '답변완료', date: '2025-06-12' },
    { id: 6, title: '문의 제목 예시 3', status: '답변완료', date: '2025-06-13' },
    { id: 7, title: '문의 제목 예시 4', status: '답변대기', date: '2025-06-13' },
    { id: 8, title: '문의 제목 예시 5', status: '답변완료', date: '2025-06-13' },
    { id: 9, title: '문의 제목 예시 6', status: '답변완료', date: '2025-06-13' },
    { id: 10, title: '문의 제목 예시 7', status: '답변완료', date: '2025-06-13' },
    { id: 11, title: '문의 제목 예시 8', status: '답변완료', date: '2025-06-13' }
];

export default function InquiryList() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredInquiries = inquiryData.filter(inquiry =>
        inquiry.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inquiry.do" className="active">1:1문의</a>
                    <a href="notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="centered-nav-row">
                    <a href="iquiryList.do" className="nav-link">내가 문의한 내역</a>
                    {/*<span className="nav-dot">·</span>*/}
                    <img src="./img/dot.png" alt="검색" />
                    <a href="inquiry.do" className="nav-text">1:1 문의하기</a>
                </div>
                <div className="board-top">
                    <span className="total">전체 {filteredInquiries.length}건</span>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="검색어를 입력해주세요"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // 검색 시 페이지 초기화
                            }}
                        />
                        <button className="search-btn">
                            <img src="./img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {currentItems.map((item) => (
                        <li key={item.id}>
                            <div className="num">{item.id}</div>
                            <div className="title">
                                {item.title}
                                <span className="badge" style={{ background: item.status === '답변완료' ? '#EA6946' : '#B3B2B2' }}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="date">{item.date}</div>
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button className="prev" onClick={handlePrev} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <span
                            key={number}
                            className={currentPage === number ? 'active' : ''}
                            onClick={() => handleClick(number)}
                        >
                            {number}
                        </span>
                    ))}
                    <button className="next" onClick={handleNext} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
