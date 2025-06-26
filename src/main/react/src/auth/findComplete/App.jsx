import React, {useEffect, useState} from 'react'
import Loader from "../../Loader/Loader";
import {useLocation} from "react-router-dom";
export default function App() {

    const [userId, setUserId] = useState('');
    const [userCreatedAt, setUserCreatedAt] = useState('');
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


    // 정보 불러오기
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const CA = sessionStorage.getItem('recoveredUserCreatedAt');
        const UI = sessionStorage.getItem('recoveredUserId');
        const formattedDate = CA ? new Date(CA).toISOString().split('T')[0] : '';
        setUserCreatedAt(formattedDate);
        setUserId(UI);
        sessionStorage.removeItem('recoveredUserCreatedAt');
        sessionStorage.removeItem('recoveredUserId');
        console.log(token);
        if (token) {
            fetch('/api/v1/validateToken?token=' + token)
                .then(res => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .catch(() => {
                    alert("유효하지 않은 토큰입니다.");
                    window.location.href = "/login.do";
                });
        } else{
            alert("잘못된 접근 입니다.");
            window.location.href = "/login.do";
        }
    }, []);


    const btn = (e) => {
        if(e.target.className === 'button1'){
            window.location.href="/login.do";
        }
        if(e.target.className === 'button2'){
            window.location.href="/searchpw.do"
        }
    }

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <section>
            <div className="sec">
            <img src="/img/checkRing.png" alt="Logo" width="120px" height="120px" />
            <h1>
                아이디 찾기 완료
            </h1>
            <div className="box">

                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td>아이디</td>
                            <td>
                                <span>{userId}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>가입일</td>
                            <td>
                               <span>{userCreatedAt}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>
                <div>
                    <button className="button1" type="button"
                    onClick={btn}>로그인</button>
                    <button className="button2" type="button"
                    onClick={btn}>비밀번호 찾기</button>
                </div>
            </div>
        </section>
    )
}
