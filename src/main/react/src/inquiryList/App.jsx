import React, { useState } from 'react';
import './inquiryList.css'; // 별도로 만들거나, notice.css/faq.css 스타일을 재사용

const inquiryData = [
    { id: 1, title: '경매 입찰 방법이 궁금합니다', status: '답변완료', date: '2025-06-01' },
    { id: 2, title: '계정 정보 변경 안내', status: '답변대기', date: '2025-06-05' },
    { id: 3, title: '결제 오류 문의', status: '답변완료', date: '2025-06-10' }
];

export default function InquiryList() {
    const [search, setSearch] = useState('');

    const filteredInquiries = inquiryData.filter(inquiry =>
        inquiry.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inquiryList.do" className="active">1:1문의</a>
                    <a href="notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="board-top">
                    <span className="total">전체 {inquiryData.length}건</span>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="검색어를 입력하세요"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="search-btn">
                            <img src="./img/searchIcon.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {filteredInquiries.map((item) => (
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
                    <button className="prev" disabled>
                        &lt;
                    </button>
                    <span className="active">1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                    <button className="next">&gt;</button>
                </div>
            </div>
        </div>
    );
}
