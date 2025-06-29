import React, {useEffect, useRef, useState} from 'react'
import Loader from "../../Loader/Loader";
export default function App() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);
    const idRef = useRef();
    const email1Ref = useRef();
    const email2Ref = useRef();
    const nameRef = useRef();
    const phone2Ref = useRef();
    const phone3Ref = useRef();
    const phoneRegex = /^[0-9]+$/;


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
        email1: '',
        email2: '',
        name: '',
        phone1: '010',
        phone2: '',
        phone3: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.id.length < 6 || formData.id.length > 20) {
            alert("아이디는 6자 이상 20자 이하로 입력해주세요.");
            idRef.current?.focus();
            return;
        }

        if(formData.name.length < 1 || formData.name.length > 20) {
            alert(" 이름은 1자 이상 20자 이하로 입력해주세요.");
            nameRef.current?.focus();
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

        const response = await fetch('api/v1/searchPw',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if(response.ok) {
            const data = await response.json();


            const token = data.token
            window.location.href = `/changePw.do?token=${token}`;
        } else{
            alert("회원을 찾을 수 없습니다.");
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
            <img src="/img/search1.png" alt="Logo" width="120px" height="120px" />
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
                            <input type="text"
                                   name="id"
                                      ref={idRef}
                                   value={formData.id}
                                   onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>
                            <input type="text"
                                   name="name"
                                      ref={nameRef}
                                   value={formData.name}
                                   onChange={handleChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>이메일</td>
                        <td className="email-box">
                            <input type="text" style={{width:'130px'}}
                                   name="email1"
                                      ref={email1Ref}
                                   value={formData.email1}
                                   onChange={handleChange}
                            />
                            <span style={{margin:"0 3px"}}>@</span>
                            <input type="text" style={{width:'78px'}}
                                   name="email2"
                                      ref={email2Ref}
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
                                   maxLength={4}
                                   value={formData.phone2}
                                      ref={phone2Ref}
                                   onChange={(e) => {
                                       const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                       setFormData({ ...formData, phone2: onlyNums });
                                   }}/>
                            <span style={{margin:"0 6px"}}>-</span>
                            <input type="text" style={{width:'100px'}}
                                   name="phone3"
                                   maxLength={4}
                                   value={formData.phone3}
                                        ref={phone3Ref}
                                   onChange={(e) => {
                                       const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                       setFormData({ ...formData, phone3: onlyNums });
                                   }}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <button type="button"
                            className="search-btn"
                            onClick={handleSubmit}
                    >비밀번호 찾기</button>
                </div>

            </div>
            </div>
        </section>
    )
}
