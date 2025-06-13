import React from 'react'
import './noticeDetail.css'

export default function Notice() {
    return (
        <div className="box">
            <div className="head">
                <h1>고객센터</h1>
                <p>
                    BidCast에 대해 궁금하신 점이 있다면<br />
                    무엇이든 물어보세요!
                </p>
                <div className="nav">
                    <a href="faq.do" className="faq">FAQ</a>
                    <a href="inquiry.do">1:1문의</a>
                    <a href="notice.do" className="active">공지사항</a>
                </div>
            </div>
            <div className="container">
                <h2 className="notice-title">경매 개장시간 안내</h2>
                <div className="notice-date">2025.06.09</div>
                <div className="notice-content">
                    <b>※ 경매 시간 안내 공지</b><br />
                    안녕하세요, 고객 여러분.<br />
                    항상 저희 경매마켓을 이용해주셔서 감사합니다.<br /><br />
                    이번 주 경매 일정은 아래와 같이 진행될 예정이오니, 참고하셔서 많은 참여 부탁드립니다.<br /><br />
                    <b>경매 일정</b><br />
                    - 일시: <span>2025년 6월 12일(목) 오후 2시</span><br />
                    - 입찰 시작 시간: <span>오후 2시 정각</span><br />
                    - 입찰 마감 시간: <span>본부장 안내 (현장 안내 참고)</span><br />
                    - 시그널 30초 전까지 입찰 완료 부탁드립니다.<br />
                    - 사정에 따라 변동될 수 있습니다.<br /><br />
                    감사합니다.
                </div>
                <div className="notice-btn-wrap">
                    <a href="notice.do"><button className="notice-list-btn">목록</button></a>
                </div>
            </div>
        </div>
    )
}
