// App.jsx
import React, { useState } from 'react';

import './faq.css';


const faqData = [
    {
        q: '경매는 어떻게 진행 되나요?',
        a: '실시간으로 라이브를 통해 경매가 이루어집니다.',
        member: true,
    },
    {
        q: '회원가입이 어떻게해요?',
        a: '몰라요',
        member: true,
    },
    {
        q: '회원가입이 어떻게해요?',
        a: '몰라요',
        member: true,
    },
    {
        q: '회원가입이 어떻게해요?',
        a: '몰라요',
        member: true,
    },
];

export default function Notice() {
    // 여러 토글 동시 오픈
    const [openList, setOpenList] = useState([]);
    const [search, setSearch] = useState('');

    const filteredFaqs = faqData
        .map((item, idx) => ({ ...item, idx }))
        .filter(faq => faq.q.toLowerCase().includes(search.toLowerCase()));

    const handleToggle = idx => {
        setOpenList(list =>
            list.includes(idx) ? list.filter(i => i !== idx) : [...list, idx]
        );
    };

    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>
                    BidCast에 대해 궁금하신 점이 있다면<br />
                    무엇이든 물어보세요!
                </p>
                <div className="nav">
                    <a href="faq.do" className="active">FAQ</a>
                    <a href="inquiryList.do">1:1문의</a>
                    <a href="notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="board-top">
                    <span className="total">총 {filteredFaqs.length}건</span>
                    <div className="search-bar">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className="search-btn" aria-label="검색">
                            <img src="./img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {filteredFaqs.map((faq, idx) => {
                        const isOpen = openList.includes(faq.idx);
                        return (
                            <li
                                key={faq.idx}
                                className={isOpen ? 'faq-open' : ''}
                                onClick={() => handleToggle(faq.idx)}
                            >
                                <div className="faq-q">
                                    <span className="faq-icon q">Q</span>
                                    <span className="faq-badge">[회원]</span>
                                    <span className="faq-question">{faq.q}</span>
                                    <span
                                        className={`faq-arrow${isOpen ? ' open' : ''}`}
                                        aria-label="화살표"
                                    >
                    ▼
                  </span>
                                </div>
                                {isOpen && faq.a && (
                                    <div className="faq-a">
                                        <span className="faq-icon a">A</span>
                                        <span className="faq-answer">{faq.a}</span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
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
