import React from 'react'
export default function App() {
    return (
        <section>
            <div className="sec">
            <img src="./img/checkRing.png" alt="Logo" width="150px" height="150px" />
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
                    <button className="button1" type="button">로그인</button>
                    <button className="button2" type="button">비밀번호 찾기</button>
                </div>
            </div>
        </section>
    )
}
