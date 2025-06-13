import React from 'react'
export default function App() {
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
