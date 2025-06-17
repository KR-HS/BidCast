import React, { useEffect, useState } from 'react';
import './inquiry.css';
import Loader from "../Loader/Loader";

export default function CustomerCenter() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    // 문의글 입력값 상태
    const [form, setForm] = useState({ userKey: '', title: '', content: '' });

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

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        // userKey는 실제 로그인한 사용자라면 context 등에서 가져오세요.
        // 지금은 테스트용으로 1로 고정
        const inquiryData = { ...form, userKey: 1 };

        try {
            const response = await fetch('http://localhost:8888/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inquiryData)
            });
            if (response.ok) {
                alert('등록 성공');
                setForm({ userKey: '', title: '', content: '' });
            } else {
                alert('등록 실패');
            }
        } catch (err) {
            alert('에러 발생');
        }
    };

    if (isLoading) {
        return <Loader />;
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
                    <img src="./img/dot.png" alt="검색" />
                    <a href="inquiry.do" className="nav-link">1:1 문의하기</a>
                </div>
                <form className="inquiry-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">제목</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="form-input"
                            placeholder="제목을 입력하세요"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content" className="form-label">내용</label>
                        <textarea
                            id="content"
                            name="content"
                            className="form-textarea"
                            placeholder="내용을 입력하세요"
                            rows={7}
                            value={form.content}
                            onChange={handleChange}
                        ></textarea>
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
