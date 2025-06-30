import React, {useEffect, useState} from 'react'
import Loader from "../../Loader/Loader";
export default function App() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);
    const [vpw, setVpw] = useState('');
    const [formData, setFormData] = useState({
        userKey: '', pw: ''
    });

    const params = new URLSearchParams(window.location.search);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const token = params.get('token');
        if (token) {
            fetch('/api/v1/validateToken?token=' + token)
                .then(res => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then(data => {
                    setFormData({ ...formData, userKey: data.userKey });
                    console.log(formData.userKey);
                })
                .catch(() => {
                    alert("유효하지 않은 토큰입니다.");
                    window.location.href = "/login.do";
                });
        } else{

            alert("잘못된 접근 입니다.")
            window.location.href = "/login.do";
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.pw !== vpw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if( formData.pw.length < 8 || formData.pw.length > 20) {
            alert("비밀번호는 8자 이상 20자 이하로 입력해주세요.");
            return;
        }

        const response = await fetch('/api/v1/changePw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            window.location.href = '/login.do';
        } else {
            alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
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
            <img src="/img/password1.png" alt="Logo" width="120px" height="120px" />
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
                            <input type="password" value={formData.pw}
                            name="pw"
                            onChange={handleChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>신규 비밀번호 확인</td>
                        <td>
                            <input type="password" value={vpw}
                            onChange={(e)=>{
                                setVpw(e.target.value);
                            }}/>
                        </td>
                    </tr>

                    </tbody>
                </table>
                <div>
                    <button type="submit"
                            className="change-pw-btn"
                    onClick={handleSubmit}>비밀번호 변경</button>
                </div>

            </div>
            </div>
        </section>
    )
}
