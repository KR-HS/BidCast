import React, {useEffect, useState} from 'react'
import './App.css'

const images = [
    '/img/slide1.png',
    '/img/slide2.png',
];
export default function App() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 3000); // 3초마다 전환

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="dashboard-container">
            <div className="top-section">
                <img
                    src={images[current]}
                    alt={`슬라이드${current + 1}`}
                    className="slide-image"
                />
                <div className="action-buttons">
                    <div className="main-actions">
                        <div className="action">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                                alt="경매검색"
                                className="action-icon"
                            />
                            <div className="action-label">경매검색</div>
                        </div>
                        <div className="action">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                                alt="경매일정"
                                className="action-icon"
                            />
                            <div className="action-label">경매일정</div>
                        </div>
                    </div>
                    <div className="login-section">
                        <button className="btn login">로그인</button>
                        <div className="signup-row">
                            <span className="signup-link">회원가입</span>
                        </div>
                        <div className="login-desc">
                            지금 로그인하세요!<br />
                            마이피드로 더 편리하게 검색할 수 있어요<span role="img" aria-label="smile">😊</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="notice">
                <span role="img" aria-label="notice">📢</span>
                &nbsp;경매 시작은 항상 오전 9시에 오픈됩니다. 일정 없이 변동될 수 있습니다.
            </div>

            <div className="calendar-header">
                <button className="calendar-tab active">경매일정</button>
            </div>
            <div className="main-section">
                <div className="calendar-section">
                    <input type="date"/>
                </div>
                <div className="auction-list">
                    <div className="auction-list-header">
                        <span className="auction-date">
                            2025.06.05
                            <span className="today-label">(오늘)</span>
                        </span>
                        <span className="auction-dropdown">경매일정 전체보기 &gt;</span>
                    </div>
                    <h3>경매리스트</h3>
                    <ul>
                        <li>상품1</li>
                        <li>상품2</li>
                    </ul>
                </div>

            </div>

            <button className="floating-btn">＋</button>
        </div>
    )
}
