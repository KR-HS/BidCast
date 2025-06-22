import React, {useEffect, useRef, useState} from 'react'
import Loader from "../../Loader/Loader";


export default function App() {

    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    const idRef = useRef();
    const pwRef = useRef();
    const vpwRef = useRef();
    const email1Ref = useRef();
    const email2Ref = useRef();
    const nameRef = useRef();
    const birthRef = useRef();
    const phone2Ref = useRef();
    const phone3Ref = useRef();
    const nickNameRef = useRef();
    const phoneRegex = /^[0-9]+$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|\\;:'",.<>/?`~\-]).{8,16}$/;

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

    const [formData, setFormData] = useState({
        id: '',
        pw: '',
        vpw: '',
        email1: '',
        email2: '',
        name: '',
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


        if(formData.id.length < 7 || formData.id.length > 20) {
            alert("아이디는 7자 이상 20자 이하로 입력해주세요.");
            idRef.current?.focus();
            return;
        }

        if (!pwRegex.test(formData.pw)) {
            alert("비밀번호는 8자 이상 20자 이하로, 영문, 숫자, 특수문자를 포함해야 합니다.");
            pwRef.current?.focus();
            return;
        }
        if( formData.pw !== formData.vpw) {
            alert("비밀번호가 일치하지 않습니다.")
            vpwRef.current?.focus();
            return;
        }

        if(formData.email1 === '' || formData.email2 === '') {
            alert("이메일을 입력해주세요.");
            if(formData.email1 === '') {
                email1Ref.current?.focus();
                return;
            }
            email2Ref.current?.focus();
            return;
        }

        if(formData.name.length < 1 || formData.name.length > 20) {
            alert(" 이름은 1자 이상 20자 이하로 입력해주세요.");
            nameRef.current?.focus();
            return;
        }

        if(formData.birthday === '') {
            alert("생년월일을 입력해주세요.");
            birthRef.current?.focus();
            return;
        }

        if (!phoneRegex.test(formData.phone2) || formData.phone2.length < 3 || formData.phone2.length > 4) {
            alert("연락처 중간 자리는 숫자 3~4자리로 입력해주세요.");
            phone2Ref.current?.focus();
            return;
        }
        if (!phoneRegex.test(formData.phone3) || formData.phone3.length !== 4) {
            alert("연락처 마지막 자리는 숫자 4자리로 입력해주세요.");
            phone3Ref.current?.focus();
            return;
        }

        if(formData.nickName.length < 3 || formData.nickName.length > 20) {
            alert("닉네임은 3자 이상 20자 이하로 입력해주세요.");
            nickNameRef.current?.focus();
            return;
        }

        try {
            const response = await fetch('/api/v1/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/login.do'; // 회원가입 후 로그인 페이지로 이동
            } else {
                const errorData = await response.json(); // 서버에서 보낸 메시지 받기
                alert(errorData.message);
            }
        } catch (error) {
            console.error('회원가입 요청 중 오류 발생:', error);
            alert('회원가입 요청 중 네트워크 오류가 발생했습니다.');
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
                <h1>환영합니다!</h1>
                <div>
                    <form>
                    <table>
                        <tbody>
                        <tr>
                            <td>아이디</td>
                            <td>
                                <input type="text"
                                       name="id"
                                value={formData.id}
                                ref={idRef}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호</td>
                            <td>
                                <input type="password"
                                       name="pw"

                                value={formData.pw}
                                ref={pwRef}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호 확인</td>
                            <td>
                                <input type="password"
                                       name="vpw"
                                       ref={vpwRef}
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
                                       ref={email1Ref}
                                       onChange={handleChange}
                                />
                                <span style={{margin:"0 3px"}}>@</span>
                                <input type="text" style={{width:'78px'}}
                                        name="email2"
                                       value={formData.email2}
                                       ref={email2Ref}
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
                            <td>이름</td>
                            <td>
                                <input type="text"
                                       name="name"
                                value={formData.name}
                                ref={nameRef}
                                onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>생년월일</td>
                            <td>
                                <input type="date"
                                       name="birthday"
                                value={formData.birthday}
                                ref={birthRef}
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
                                       maxLength={4}
                                        ref={phone2Ref}
                                       onChange={(e) => {
                                           const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                           setFormData({ ...formData, phone2: onlyNums });
                                       }}

                                />
                                <span style={{margin:"0 6px"}}>-</span>
                                <input type="text" style={{width:'100px'}}
                                       name="phone3"
                                value={formData.phone3}
                                       maxLength={4}
                                        ref={phone3Ref}
                                       onChange={(e) => {
                                           const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                           setFormData({ ...formData, phone3: onlyNums });
                                       }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>닉네임</td>
                            <td>
                                <input type="text"
                                       name="nickName"
                                value={formData.nickName}
                                ref={nickNameRef}
                                onChange={handleChange}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </form>
                </div>
                <div className="join-btn">
                <button type="submit"
                        onClick={handleSubmit}
                >회원가입</button>
                </div>
            </div>
        </section>
    )
}
