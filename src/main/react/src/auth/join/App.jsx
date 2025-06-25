import React, {useEffect, useRef, useState} from 'react';
import Loader from "../../Loader/Loader";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import koLocale from 'date-fns/locale/ko';
import TextField from '@mui/material/TextField'; // 파일 상단에 추가


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

    const [idValid, setIdValid] = useState(false);
    const [pwValid,setPwValid] = useState(false);
    const [vpwValid,setVpwValid] = useState(false);
    const [idDuplicate, setIdDuplicate] = useState(null); // null: 체크 안함, true: 중복, false: 사용가능
    const idCheckTimeout = useRef(null);

    const idRegex=/^[a-zA-Z0-9]{6,20}$/
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

    const [datePickerOpen, setDatePickerOpen] = useState(false);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // console.log(value)

        if (name === 'id') {
            // 유효성 검사
            const valid = idRegex.test(value);
            setIdValid(valid);

            // 중복체크 초기화
            setIdDuplicate(null);

            if (idCheckTimeout.current) clearTimeout(idCheckTimeout.current);
            // console.log("유효성검사",valid);
            if (valid) {
                // console.log("요청보냄");
                idCheckTimeout.current = setTimeout(() => {
                    fetch(`/fetch/check-id?id=${value}`)
                        .then(res => {
                            return res.json();
                        })
                        .then(data => {
                            setIdDuplicate(data.duplicate);
                        })
                        .catch((err) => {
                            setIdDuplicate(null);
                        });
                }, 500);
            }
        }
        else if(name==='pw'){
            const valid = pwRegex.test(value);
            setPwValid(valid);
        }
        else if(name === 'vpw'){
            const valid = (value === formData.pw);
            setVpwValid(valid);
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!idRegex.test(formData.id)) {
            // alert("아이디는 6자 이상 20자 이하로 입력해주세요.");
            idRef.current?.focus();
            return;
        }

        if(idDuplicate){
            alert("이미 등록된 아이디 입니다.");
            idRef.current?.focus();
        }

        if (!pwRegex.test(formData.pw)) {
            alert("비밀번호는 8자 이상 20자 이하로, 영문, 숫자, 특수문자를 포함해야 합니다.");
            pwRef.current?.focus();
            return;
        }
        if (formData.pw !== formData.vpw) {
            alert("비밀번호가 일치하지 않습니다.")
            vpwRef.current?.focus();
            return;
        }

        if (formData.email1 === '' || formData.email2 === '') {
            alert("이메일을 입력해주세요.");
            if (formData.email1 === '') {
                email1Ref.current?.focus();
                return;
            }
            email2Ref.current?.focus();
            return;
        }

        if (formData.name.length < 1 || formData.name.length > 20) {
            alert(" 이름은 1자 이상 20자 이하로 입력해주세요.");
            nameRef.current?.focus();
            return;
        }

        if (formData.birthday === '') {
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

        if (formData.nickName.length < 3 || formData.nickName.length > 20) {
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
    if (isLoading) return <Loader/>;

    return (
        <section>
            <div className="sec">
                <h1>회원가입</h1>
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
                                           placeholder="영문,숫자 6~20자로 입력해주세요."
                                    />
                                    {formData.id && !idValid && (
                                        <p className="validationInfo" style={{ color: 'red', fontSize: '12px' }}>
                                            영문,숫자 6~20자로 입력해주세요.
                                        </p>
                                    )}
                                    {idValid && idDuplicate === false && (
                                        <p className="validationInfo" style={{ color: 'green', fontSize: '12px' }}>
                                            사용 가능한 아이디입니다.
                                        </p>
                                    )}
                                    {idValid && idDuplicate === true && (
                                        <p className="validationInfo" style={{ color: 'red', fontSize: '12px' }}>
                                            이미 사용 중인 아이디입니다.
                                        </p>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td>비밀번호</td>
                                <td>
                                    <input type="password"
                                           name="pw"
                                           placeholder="영문,숫자,특수기호 조합 8글자 이상 입력해주세요."
                                           value={formData.pw}
                                           ref={pwRef}
                                           onChange={handleChange}
                                    />
                                    {formData.pw && !pwValid && (
                                        <p className="validationInfo" style={{ color: 'red', fontSize: '12px' }}>
                                            올바르지 않은 비밀번호형식입니다.
                                        </p>
                                    )}
                                    {pwValid && (
                                        <p className="validationInfo" style={{ color: 'green', fontSize: '12px' }}>
                                            올바른 비밀번호 형식입니다.
                                        </p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>비밀번호 확인</td>
                                <td>
                                    <input type="password"
                                           name="vpw"
                                           ref={vpwRef}
                                           value={formData.vpw}
                                           placeholder="비밀번호를 다시 입력해주세요"
                                           onChange={handleChange}
                                    />
                                    {formData.vpw && !vpwValid && (
                                        <p className="validationInfo" style={{ color: 'red', fontSize: '12px' }}>
                                            비밀번호가 일치하지 않습니다.
                                        </p>
                                    )}
                                    {vpwValid && (
                                        <p className="validationInfo" style={{ color: 'green', fontSize: '12px' }}>
                                            비밀번호가 일치합니다.
                                        </p>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>이메일</td>
                                <td className="email-box">
                                    <input type="text" style={{width: '130px'}}
                                           name="email1"
                                           value={formData.email1}
                                           ref={email1Ref}
                                           onChange={handleChange}
                                    />
                                    <span style={{margin: "0 3px"}}>@</span>
                                    <input type="text" style={{width: '78px'}}
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
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
                                        <DatePicker
                                            label={null}
                                            inputFormat="yyyy-MM-dd"
                                            value={formData.birthday ? new Date(formData.birthday) : null}
                                            onChange={(date) => {
                                                const formatted = date ? date.toISOString().slice(0, 10) : '';
                                                setFormData({...formData, birthday: formatted});
                                            }}
                                            enableAccessibleFieldDOMStructure={false}
                                            open={datePickerOpen}
                                            onOpen={() => setDatePickerOpen(true)}
                                            onClose={() => setDatePickerOpen(false)}
                                            slots={{
                                                textField: (props) => (
                                                    <TextField
                                                        {...props}
                                                        onClick={() => setDatePickerOpen(true)}
                                                    />
                                                ),
                                            }}
                                        />
                                    </LocalizationProvider>
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
                                    <span style={{margin: "0 6px"}}>-</span>
                                    <input type="text" style={{width: '90px'}}
                                           name="phone2"
                                           value={formData.phone2}
                                           maxLength={4}
                                           ref={phone2Ref}
                                           onChange={(e) => {
                                               const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                               setFormData({...formData, phone2: onlyNums});
                                           }}

                                    />
                                    <span style={{margin: "0 6px"}}>-</span>
                                    <input type="text" style={{width: '90px'}}
                                           name="phone3"
                                           value={formData.phone3}
                                           maxLength={4}
                                           ref={phone3Ref}
                                           onChange={(e) => {
                                               const onlyNums = e.target.value.replace(/\D/g, ''); // 숫자만
                                               setFormData({...formData, phone3: onlyNums});
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
                    >등록
                    </button>
                </div>
            </div>
        </section>
    )
}
