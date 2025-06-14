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

    const [formData, setFormData] = useState({
        name:'', email:'',phoneNum:'',
        email1: '',
        email2: '',
        phone1: '010',
        phone2: '',
        phone3: ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData({...formData,[name]:value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('api/v1/searchId',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/findcomplete.do';
                } else {
                    alert('회원을 찾을 수 없습니다.');
                }
            })
            .catch(error => {
                console.error('오류 발생:', error);
                alert('오류가 발생했습니다.');
            })

    }
    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <section>
            <div className="sec">
            <img src="./img/search1.png" alt="Logo" width="120px" height="120px" />
            <h1>
                아이디찾기
            </h1>
            <div className="box">
                <h3 style={{color:"#EA6946"}}>
                    회원 정보를 입력해주세요
                </h3>
                <table>
                    <tbody>
                    <tr>
                        <td>이름</td>
                        <td>
                            <input type="text"
                                   name="name"
                                   value={formData.name}
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
                    </tbody>
                </table>
                <div>
                    <button type="submit"
                            onClick={handleSubmit}>아이디 찾기</button>
                </div>

            </div>
            </div>
        </section>
    )
}
