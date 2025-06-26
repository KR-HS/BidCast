import React, { useEffect, useState, useRef } from 'react';
import './inquiryList.css';
import Loader from "../Loader/Loader";

export default function InquiryList() {
    const [isLoading, setIsLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openList, setOpenList] = useState([]);
    const itemsPerPage = 7;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // credentials: 'include'는 세션/쿠키 인증에 필요
                const res = await fetch('/api/inquiryList', { credentials: 'include' });
                if (res.status === 401) {
                    alert('로그인이 필요합니다.');
                    window.location.href = '/login.do'; // Spring Security의 로그인 경로
                    return;
                }
                const data = await res.json();
                // console.log(data);
                setInquiries(Array.isArray(data) ? data : []);
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

        const timer = setTimeout(() => {
            fetchData();
        }, 500);

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
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (isLoading) return <Loader />;

    return (
        <div className="box">
            <div className="head">
                <h3>고객센터</h3>
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="/faq.do" className="faq">FAQ</a>
                    <a href="/inquiry.do" className="active">1:1문의</a>
                    <a href="/notice.do">공지사항</a>
                </div>
            </div>

            <div className="container">
                <div className="centered-nav-row">
                    <a href="/inquiryList.do" className="nav-link">내가 문의한 내역</a>
                    <img src="/img/dot.png" alt="구분점" />
                    <a href="/inquiry.do" className="nav-text">1:1 문의하기</a>
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
                            <img src="/img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>

                <ul className="board-list">
                    {currentItems.length === 0 ? (
                        <li className="no-result">검색 결과가 없습니다.</li>
                    ) : (
                        currentItems.map((item) => (
                            <InquiryItem
                                key={item.inquiryKey}
                                item={item}
                                isOpen={openList.includes(item.idx)}
                                onToggle={() => handleToggle(item.idx)}
                                formatDate={formatDate}
                            />
                        ))
                    )}
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

function InquiryItem({ item, isOpen, onToggle, formatDate }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <li
            className={isOpen ? 'faq-open' : ''}
            onClick={onToggle}
            style={{ cursor: 'pointer' }}
        >
            <div className="faq-q">
                <div className="faq-left">
                    {/* 글번호 표시 */}
                    <span className="faq-number">{item.inquiryKey}</span>
                    <span className="faq-icon q">문의</span>
                    <span className="faq-question">{item.title}</span>
                </div>

                <div className="faq-meta">
                    <span className="date">{item.createDate ? formatDate(item.createDate) : ''}</span>
                    <span className={`faq-badge ${item.reply === '답변완료' ? 'complete' : 'pending'}`}>
                        {item.reply}
                    </span>
                </div>
            </div>

            <div
                className="faq-a"
                ref={contentRef}
                style={{
                    height: height,
                    overflow: 'hidden',
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <span className="faq-icon a">문의내용</span>
                <span className="faq-answer">
                    {item.content || '문의 내용이 없습니다.'}
                    <br />
                    <strong>답변:</strong> {item.replyContent || '아직 답변이 등록되지 않았습니다.'}
                </span>
            </div>
        </li>
    );
}
