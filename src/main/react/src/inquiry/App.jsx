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


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/inquiry/auth-check', { credentials: 'include' });
                if (res.status === 401) {
                    alert('로그인이 필요합니다.');
                    window.location.href = './login.do';
                }
            } catch (err) {
                alert('로그인이 필요합니다.');
                window.location.href = './login.do';
            }
        };
        checkAuth();
    }, []);


    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inquiryData = { ...form }; // userKey는 백엔드에서 처리

        try {
            const response = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inquiryData),
                credentials: 'include'
            });
            if (response.status === 401) {
                alert('로그인이 필요합니다.');
                window.location.href = './login.do';
                return;
            }
            if (response.ok) {
                alert('문의가 등록 되었습니다.');
                setForm({ title: '', content: '' });
                window.location.href = '/inquiryList.do';
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
                <h3>고객센터</h3>
                <p>BidCast에 대해 궁금하신 점이 있다면<br />무엇이든 물어보세요!</p>
                <div className="nav">
                    <a href="/faq.do" className="faq">FAQ</a>
                    <a href="/inquiry.do" className="active">1:1문의</a>
                    <a href="/notice.do">공지사항</a>
                </div>
            </div>
            <div className="container">
                <div className="centered-nav-row">
                    <a href="/inquiryList.do" className="nav-text">내가 문의한 내역</a>
                    <img src="/img/dot.png" alt="검색" />
                    <a href="/inquiry.do" className="nav-link">1:1 문의하기</a>
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
