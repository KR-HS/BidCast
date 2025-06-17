import React, { useEffect, useState } from 'react';
import './search.css';
import Loader from "../Loader/Loader";

// 예시 경매 카드 데이터
const auctionList = [
    {
        id: 1,
        thumbnail: "./img/thumbnail.png",
        state: "진행중",
        product: "루이암스트롱의 앨범",
    },
    {
        id: 2,
        thumbnail: "./img/thumbnail.png",
        state: "진행중",
        product: "포켓몬 카드",
    },
    {
        id: 3,
        thumbnail: "./img/thumbnail.png",
        state: "진행중",
        product: "포켓몬 카드",
    },
    {
        id: 4,
        thumbnail: "./img/thumbnail.png",
        state: "진행중",
        product: "포켓몬 카드",
    },
    // ...더 많은 카드 데이터
];

export default function AuctionSearch() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="auction-search">
            <div className="search-header">

                <h2>경매검색</h2>
                <p>다양한 필터를 활용하여 원하는 라이브를 빠르게 찾아보세요</p>
                <div className="search-bar-row">
                    <input className="search-input" placeholder="제목 또는 호스트를 입력하세요" />
                    <select className="search-select">
                        <option>분류</option>
                        {/* 옵션 추가 */}
                    </select>
                    <button className="search-btn">검색</button>
                </div>
            </div>
            <div className="card-list">
                {auctionList.map(item => (
                    <div className="card" key={item.id}>
                        <div className="thumbnail">
                            <img src={item.thumbnail} alt="썸네일" />
                            <span className="cast-state">{item.state}</span>
                        </div>
                        <div className="card-desc">
                            <div className="product-title">현재 매물: {item.product}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
