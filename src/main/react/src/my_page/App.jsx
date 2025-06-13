import React, {useRef, useState} from 'react'
import './myPage.css'


const items = [
    { id: 1, img: '/img/img2.jpeg', title: '모자' },
    { id: 2, img: '/img/img2.jpeg', title: '모자' },
    { id: 3, img: '/img/1.png', title: '천상의 기타' },
];

export default function myPage() {
    const [activeTab, setActiveTab] = useState('경매이력');

    const handleCardClick = (id) => {
        window.location.href = `/auctionDetail.do?id=${items.id}`;
    };

    return (
        <div className="my-page-container">
            <div className="header">
                <div className="header-title">마이페이지</div>
                <div className="header-desc">경매를 똑똑하게 즐기기, BidCast</div>
                <nav className="nav-menu">
                    {['경매이력', '낙찰내역', '문의', '내 정보수정'].map((tab) => (
                        <button
                            key={tab}
                            className={`nav-item ${activeTab === tab ? 'nav-item-active' : ''}`}
                            onClick={() => {
                            if (tab === '문의') {
                                window.location.href = '/inquiryList.do';
                            } else if (tab === '내 정보수정') {
                                window.location.href = '/membermodify.do';
                            } else {
                                setActiveTab(tab);
                            }
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === '경매이력' && (
                <>
                    <div className="content-box">
                        <div className="section-title">경매이력
                            <button className="all-btn" onClick={() => window.location.href = '/bidHistory.do'}>
                                전체 보기
                            </button>
                        </div>
                    <div className="item-list">
                        {items.map(item => (
                            <div className="item-card" key={item.id} onClick={() => handleCardClick(item.id)} >
                                <img src={item.img} alt={item.title} className="item-img" />
                                <div className="item-title">{item.title}</div>
                            </div>
                        ))}
                    </div>
                    </div>
                </>
            )}

            {activeTab === '낙찰내역' && (
                <>
                    <div className="content-box">
                    <div className="section-title">낙찰내역</div>
                    <div className="item-list">
                        {items.map(item => (
                            <div className="item-card" key={item.id}>
                                <img src={item.img} alt={item.title} className="item-img" />
                                <div className="item-title">{item.title}</div>
                            </div>
                        ))}
                    </div>
                    </div>
                </>
            )}


        </div>


    );
}