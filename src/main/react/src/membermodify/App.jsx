import React, {useState} from 'react'


export default function App() {

    const [formData, setFormData] = useState({
        pw: '',
        vpw: '',
        email1: '',
        email2: '',
        birthday: '',
        phone1: '010',
        phone2: '',
        phone3: '',
        nickName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

       await fetch('api/v1/join',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login.do'; // 회원가입 후 로그인 페이지로 이동
            } else {
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('회원가입 요청 중 오류 발생:', error);
            alert('회원가입 요청 중 오류가 발생했습니다.');
       })

    }

    return (
        <section>
            <div className="sec">
                <h1>회원정보수정</h1>
                <div>
                    <form>
                    <table>
                        <tbody>
                        <tr>
                            <td>비밀번호 변경</td>
                            <td>
                                <input type="password"
                                       name="pw"
                                value={formData.pw}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호 확인</td>
                            <td>
                                <input type="password"
                                       name="vpw"
                                value={formData.vpw}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>이메일</td>
                            <td className="email-box">
                                <input type="text" style={{width:'130px'}}
                                        name="email1"
                                       value={formData.email1}
                                       onChange={handleChange}
                                />
                                <span style={{margin:"0 3px"}}>@</span>
                                <input type="text" style={{width:'78px'}}
                                        name="email2"
                                       value={formData.email2}
                                       onChange={handleChange}
                                />
                                <select onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            email2: e.target.value
                                        });

                                }}>
                                    <option value="">직접입력</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="nate.com">nate.com</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>생년월일</td>
                            <td>
                                <input type="date"
                                       name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>연락처</td>
                            <td className="phonenum">
                                <select onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        phone1: e.target.value
                                    });

                                }}>
                                    <option value="010">010</option>
                                    <option value="011">011</option>
                                    <option value="016">016</option>
                                    <option value="017">017</option>
                                    <option value="018">018</option>
                                    <option value="019">019</option>
                                </select>
                                <span style={{margin:"0 6px"}}>-</span>
                                <input type="text" style={{width:'100px'}}
                                       name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}/>
                                <span style={{margin:"0 6px"}}>-</span>
                                <input type="text" style={{width:'100px'}}
                                       name="phone3"
                                value={formData.phone3}
                                       onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>닉네임</td>
                            <td>
                                <input type="text"
                                       name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <a href={'#'} className="del-mem">회원탈퇴</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </form>
                </div>


                <div className="modify-btn">
                <button type="submit"
                        onClick={handleSubmit}
                >정보수정</button>
                </div>
            </div>
        </section>
    )
}
