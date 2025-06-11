import React from 'react'
export default function App() {
    return (
        <section>
            <div className="calender">
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
            </div>
            <div className="cast-list">
                <div>
                    1,120건
                </div>
                <div className="card-list">
                    <div className="card-list-header">
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>

                        <div className="card">
                            <div className="thumbnail">
                                <img src="./img/thumbnail.png"/>
                                <span className="cast-state">
                                    진행중
                                </span>
                                <div className="guest-count" >참여자수: 20 명</div>
                                <div className="host-name">호스트: 김형섭</div>
                            </div>
                            <div className="title">
                                <h3>오늘 엄청난 물건 나옵니다!!</h3>
                                현재매물:루이 암스트롱의 앨범
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
