import React, { useEffect, useState } from 'react';
import './noticeDetail.css';
import Loader from "../Loader/Loader";

export default function NoticeDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState(null);

    const noticeId = new URLSearchParams(window.location.search).get("id");

    useEffect(() => {
        if (!noticeId) {
            alert("공지 ID가 없습니다.");
            return;
        }

        fetch(`/api/notices/${noticeId}`)
            .then(res => res.json())
            .then(data => {
                setNotice(data);
                setIsLoading(false);

                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }
            })
            .catch(err => {
                console.error("공지 불러오기 실패", err);
                setIsLoading(false);
            });
    }, [noticeId]);

    if (isLoading) return <Loader />;
    if (!notice) return <div className="box">공지 내용을 불러올 수 없습니다.</div>;

    return (
        <div className="box">
            <div className="head">
                <h3>고객센터</h3>
                <p>
                    BidCast에 대해 궁금하신 점이 있다면<br />
                    무엇이든 물어보세요!
                </p>
                <div className="nav">
                    <a href="/faq.do" className="faq">FAQ</a>
                    <a href="/inquiry.do">1:1문의</a>
                    <a href="/notice.do" className="active">공지사항</a>
                </div>
            </div>

            <div className="container">
                <h2 className="notice-title">{notice.title}</h2>
                <div className="notice-date">
                    {notice.regDate
                        ? new Date(notice.regDate).toISOString().slice(0, 10).replace(/-/g, '.')
                        : '날짜 없음'}
                </div>
                <div className="notice-content">
                    {notice.content.split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </div>
                <div className="notice-btn-wrap">
                    <a href="/notice.do"><button className="notice-list-btn">목록</button></a>
                </div>
            </div>
        </div>
    );
}
