import React, {useEffect, useState} from 'react';
import './inquiry.css';
import Loader from "../Loader/Loader";

export default function CustomerCenter() {

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
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inquiry.do" className="active">1:1문의</a>
                    <a href="notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="centered-nav-row">
                    <a href="inquiryList.do" className="nav-text">내가 문의한 내역</a>
                    {/*<span className="nav-dot">·</span>*/}
                    <img src="./img/dot.png" alt="검색" />
                    <a href="inquiry.do" className="nav-link">1:1 문의하기</a>
                </div>
                <form className="inquiry-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">제목</label>
                        <input id="title" type="text" className="form-input" placeholder="제목을 입력하세요" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="form-label">내용</label>
                        <textarea id="content" className="form-textarea" placeholder="내용을 입력하세요" rows={7}></textarea>
                    </div>
                    <div className="form-guide">
                        <p>
                            <b>이용안내</b><br />
                            문의시간 : 평일 오전 9:00~17:00 (주말/공휴일 휴무)<br />
                            1:1문의는 접수 후 순차적으로 답변드리며, FAQ를 먼저 확인해 주세요.
                        </p>
                    </div>
                    <button type="submit" className="submit-btn">등록</button>
                </form>
            </div>
        </div>
    );
}
