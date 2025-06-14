import React, {useEffect, useState} from 'react'
import Calendar from "./calendar";
import Loader from "../Loader/Loader";

const today = new Date();

export default function App() {

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

    const [selectedDate, setSelectedDate] = useState(today);

    const formatDate = (date) =>
        `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    const isToday = (date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <section>
            <div className="calender">
            <div className="calendar-header">
                <button className="calendar-tab active">경매일정</button>
            </div>
                <div className="main-section">
                    <div className="calendar-section">
                        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </div>
                    <div className="auction-list">
                        <div className="auction-list-header">
                        <span className="auction-date">
                            {formatDate(selectedDate)}
                            {isToday(selectedDate) && <span className="today-label"> (오늘)</span>}
                        </span>
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
