import React, {useEffect, useState} from 'react';
import './faq.css';
import Loader from "../Loader/Loader";

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
        q: '배송은 얼마나 걸리나요?',
        a: '평균 2~3일 소요됩니다.',
        member: true,
    },
    {
        q: '반품은 어떻게 하나요?',
        a: '고객센터에 문의해주세요.',
        member: true,
    },
    {
        q: '입찰은 실시간인가요?',
        a: '네, 실시간 라이브 입찰입니다.',
        member: true,
    },
    {
        q: '주소 변경은 어떻게 하나요?',
        a: '마이페이지에서 변경 가능합니다.',
        member: true,
    },
];

export default function Faq() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 예: 1초 후에 로딩 끝난 걸로 처리
        const timer = setTimeout(() => {
            setIsLoading(false)

            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500); // CSS transition과 동일 시간
            }

        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const [openList, setOpenList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // 필터링된 FAQ 목록
    const filteredFaqs = faqData
        .map((item, idx) => ({ ...item, idx }))
        .filter(faq => faq.q.toLowerCase().includes(search.toLowerCase()));

    const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

    const handleToggle = idx => {
        setOpenList(list =>
            list.includes(idx) ? list.filter(i => i !== idx) : [...list, idx]
        );
    };

    const handleClickPage = pageNum => {
        setCurrentPage(pageNum);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <Loader/>
        );
    }
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
                    <a href="inquiry.do">1:1문의</a>
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
                            onChange={e => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // 검색 시 1페이지로 초기화
                            }}
                        />
                        <button className="search-btn" aria-label="검색">
                            <img src="./img/search2.png" alt="검색" />
                        </button>
                    </div>
                </div>
                <ul className="board-list">
                    {currentFaqs.map(faq => {
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
                                    <span className={`faq-arrow${isOpen ? ' open' : ''}`}>
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
                    <button className="prev" onClick={handlePrev} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <span
                            key={num}
                            className={num === currentPage ? 'active' : ''}
                            onClick={() => handleClickPage(num)}
                        >
                            {num}
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
