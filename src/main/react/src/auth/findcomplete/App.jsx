import React, {useEffect, useState} from 'react'
import Loader from "../../Loader/Loader";
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
    const btn = (e) => {
        if(e.target.className === 'button1'){
            window.location.href="login.do";
        }
        if(e.target.className === 'button2'){
            window.location.href="searchPw.do"
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
            <img src="./img/checkRing.png" alt="Logo" width="120px" height="120px" />
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
                                <span>hshshshs</span>
                            </td>
                        </tr>
                        <tr>
                            <td>가입일</td>
                            <td>
                               <span>2025.06.05</span>
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
