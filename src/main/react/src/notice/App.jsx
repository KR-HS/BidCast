import React, {useEffect, useState} from 'react'
import './notice.css'
import Loader from "../Loader/Loader";


export default function Notice() {
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
                  BidCast에 대해 궁금하신 점이 있다면<br/>무엇이든 물어보세요!
              </p>
              <div className="nav">
                  <a href="faq.do" className="faq">FAQ</a>
                  <a href="inquiry.do">1:1문의</a>
                  <a href="notice.do" className="active">
                      공지사항
                  </a>
              </div>
          </div>
          <div className="container">
              <div className="board-top">
                  <div className="total">총1건</div>
                  <div className="search-bar">
                      <input type="text" className="search-input" placeholder="검색어를 입력해주세요"/>
                      <button className="search-btn" aria-label="검색">
                          <img src="./img/search2.png" alt="검색" />
                      </button>
                  </div>

              </div>
              <ul className="board-list">
                  <a href="noticeDetail.do">
                  <li>
                      <div className="num">1</div>
                      <div className="title">
                          <span className="badge">공지</span>
                          경매 개장시간 안내
                      </div>
                      <div className="date">2025.06.09</div>
                  </li>
                      <li>
                          <div className="num">1</div>
                          <div className="title">
                              <span className="badge">공지</span>
                              경매 개장시간 안내
                          </div>
                          <div className="date">2025.06.09</div>
                      </li>
                      <li>
                          <div className="num">1</div>
                          <div className="title">
                              <span className="badge">공지</span>
                              경매 개장시간 안내
                          </div>
                          <div className="date">2025.06.09</div>
                      </li>
                      <li>
                          <div className="num">1</div>
                          <div className="title">
                              <span className="badge">공지</span>
                              경매 개장시간 안내
                          </div>
                          <div className="date">2025.06.09</div>
                      </li>
                      <li>
                          <div className="num">1</div>
                          <div className="title">
                              <span className="badge">공지</span>
                              경매 개장시간 안내
                          </div>
                          <div className="date">2025.06.09</div>
                      </li>
                      <li>
                          <div className="num">1</div>
                          <div className="title">
                              <span className="badge">공지</span>
                              경매 개장시간 안내
                          </div>
                          <div className="date">2025.06.09</div>
                      </li>
                  </a>
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
  )
}

