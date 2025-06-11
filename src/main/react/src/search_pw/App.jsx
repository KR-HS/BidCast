import React from 'react'
export default function App() {
    return (
        <section>
            <div className="sec">
            <img src="./img/search1.png" alt="Logo" width="150px" height="150px" />
            <h1>
                비밀번호찾기
            </h1>
            <div className="box">
                <h3 style={{color:"#EA6946"}}>
                    아이디와 회원 정보를 입력해주세요
                </h3>
                <table>
                    <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>
                            <input type="text"/>
                        </td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>
                            <input type="text"/>
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
                    </tbody>
                </table>
                <div>
                    <button type="button">비밀번호 찾기</button>
                </div>

            </div>
            </div>
        </section>
    )
}
