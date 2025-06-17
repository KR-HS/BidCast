import React, { useEffect, useState } from 'react';
import './inquiryList.css';
import Loader from "../Loader/Loader";

export default function InquiryList() {
    const [isLoading, setIsLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openList, setOpenList] = useState([]);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8888/api/inquiryList');
            const data = await res.json();
            setInquiries(data);
        };

        const timer = setTimeout(async () => {
            try {
                await fetchData();
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
        }, 500); // 문의 등록과 동일하게 0.5초 지연

        return () => clearTimeout(timer);
    }, []);



    const filteredInquiries = inquiries
        .map((item, idx) => ({ ...item, idx })) // 인덱스를 함께 저장
        .filter(inquiry => inquiry.title.toLowerCase().includes(search.toLowerCase()));

    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);

    const handleToggle = (idx) => {
        setOpenList((prev) =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

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
                    <img src="./img/dot.png" alt="구분점" />
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
                                setCurrentPage(1);
                            }}
                        />
                        <button className="search-btn">
                            <img src="./img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>

                <ul className="board-list">
                    {currentItems.map((item) => {
                        const isOpen = openList.includes(item.idx);
                        return (
                            <li
                                key={item.inquiryKey}
                                className={isOpen ? 'faq-open' : ''}
                                onClick={() => handleToggle(item.idx)}
                            >
                                <div className="faq-q">
                                    <span className="faq-icon q">문의</span>
                                    {/*<span className="faq-badge">*/}
                                    {/*    {item.reply === '답변완료' ? '답변완료' : '답변대기'}*/}
                                    {/*</span>*/}
                                    <span className="faq-question">{item.title}</span>
                                    <span className={`faq-arrow${isOpen ? ' open' : ''}`}>▼</span>
                                </div>
                                {isOpen && (
                                    <div className="faq-a">
                                        <span className="faq-icon a">A</span>
                                        <span className="faq-answer">
                                            {item.content || '문의 내용이 없습니다.'}
                                            <br />
                                            <strong style={{ display: 'block', marginTop: '10px', color: '#555' }}>
                                                답변:
                                            </strong>
                                            {item.replyContent || '아직 답변이 등록되지 않았습니다.'}
                                        </span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <span
                            key={i + 1}
                            className={currentPage === i + 1 ? 'active' : ''}
                            onClick={() => handleClick(i + 1)}
                        >
                            {i + 1}
                        </span>
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                </div>
            </div>
        </div>
    );
}
