import React from 'react';
import './inquiry.css';

export default function CustomerCenter() {
    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inauiryList.do" className="active">1:1문의</a>
                    <a href="notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <h2 style={{ textAlign: 'center', margin: '40px 0 30px', fontSize: '2rem', fontWeight: 700 }}>1:1문의</h2>
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
