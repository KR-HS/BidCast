import React, { useEffect, useState } from 'react';
import './inquiryList.css';
import Loader from "../Loader/Loader";

export default function InquiryList() {
    const [isLoading, setIsLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const res = await fetch('http://localhost:8888/api/inquiryList');
                const data = await res.json();
                setInquiries(data);
            } catch (err) {
                alert('문의 목록을 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }
            }
        };
        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (pageNumber) => setCurrentPage(pageNumber);
    const handlePrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
    const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

    if (isLoading) return <Loader />;

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
                    <a href="inquiryList.do" className="nav-link">내가 문의한 내역</a>
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
                                <span className="badge" style={{ background: item.reply === '답변완료' ? '#EA6946' : '#B3B2B2' }}>
                                    {item.reply}
                                </span>
                            </div>
                            <div className="date">{new Date(item.createDate).toLocaleDateString()}</div>
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
