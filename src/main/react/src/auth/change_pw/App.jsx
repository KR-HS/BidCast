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

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <section>
            <div className="sec">
            <img src="./img/password1.png" alt="Logo" width="120px" height="120px" />
            <h1>
                비밀번호 재설정
            </h1>
            <div className="box">
                <h3 style={{color:"#EA6946"}}>
                    재설정할 비밀번호를 입력해주세요.
                </h3>
                <table>
                    <tbody>
                    <tr>
                        <td>신규 비밀번호</td>
                        <td>
                            <input type="text"/>
                        </td>
                    </tr>
                    <tr>
                        <td>신규 비밀번호 확인</td>
                        <td>
                            <input type="text"/>
                        </td>
                    </tr>

                    </tbody>
                </table>
                <div>
                    <button type="button">비밀번호 변경</button>
                </div>

            </div>
            </div>
        </section>
    )
}
