import React from 'react'
export default function App() {
    return (
        <section>
            <div className="sec">
                <h1>환영합니다!</h1>
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td>아이디</td> 
                            <td>
                                <input type="text"/>
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호</td>
                            <td>
                                <input type="password"/>
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호 확인</td>
                            <td>
                                <input type="password"/>
                            </td>
                        </tr>
                        <tr>
                            <td>이메일</td>
                            <td className="email-box">
                                <input type="text" style={{width:'130px'}}/>
                                <span style={{margin:"0 3px"}}>@</span>
                                <input type="text" style={{width:'78px'}}/>
                                <select>
                                    <option value="">직접입력</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="nate.com">nate.com</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>이름</td>
                            <td>
                                <input type="text"/>
                            </td>
                        </tr>
                        <tr>
                            <td>생년월일</td>
                            <td>
                                <input type="date"/>
                            </td>
                        </tr>
                        <tr>
                            <td>연락처</td>
                            <td className="phonenum">
                                <select>
                                    <option value="010">010</option>
                                    <option value="011">011</option>
                                    <option value="016">016</option>
                                    <option value="017">017</option>
                                    <option value="018">018</option>
                                    <option value="019">019</option>
                                </select>
                                <span style={{margin:"0 6px"}}>-</span>
                                <input type="text" style={{width:'100px'}}/>
                                <span style={{margin:"0 6px"}}>-</span>
                                <input type="text" style={{width:'100px'}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>닉네임</td>
                            <td>
                                <input type="text"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="join-btn">
                <button type="button">회원가입</button>
                </div>
            </div>
        </section>
    )
}
