import React, { useEffect, useState } from 'react';
import Loader from "../Loader/Loader";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [isSocial, setIsSocial] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await fetch("/api/v1/getUserInfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const result = await res.json();

            const isSocialLogin = result.loginId.includes("socialId_");
            setIsSocial(isSocialLogin);

            if (isSocialLogin) {
                setFormData({
                    userKey: result.userKey,
                    nickName: result.nickName
                });
            } else {
                setFormData({
                    userKey: result.userKey,
                    email1: result.email.split('@')[0],
                    email2: result.email.split('@')[1],
                    birthday: result.birth,
                    phone1: result.phone.split('-')[0],
                    phone2: result.phone.split('-')[1],
                    phone3: result.phone.split('-')[2],
                    nickName: result.nickName
                });
            }
        };
        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData) return;

        try {
            let userData;

            if (isSocial) {
                userData = { nickName: formData.nickName };
            } else {
                // 전화번호 형식 확인
                if (!/^\d{3,4}$/.test(formData.phone2) || !/^\d{4}$/.test(formData.phone3)) {
                    alert("올바른 전화번호 형식을 입력해주세요.");
                    return;
                }

                userData = {
                    email1: formData.email1,
                    email2: formData.email2,
                    birth: formData.birthday,
                    phone1: formData.phone1,
                    phone2: formData.phone2,
                    phone3: formData.phone3,
                    nickName: formData.nickName
                };
            }

            const response = await fetch("/api/v1/memberModify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert("회원정보가 성공적으로 수정되었습니다.");
                    window.location.href = "/myPage.do";
                } else {
                    alert(result.message || "회원정보 수정에 실패했습니다.");
                }
            } else {
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("회원정보 수정 중 오류 발생:", error);
            alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    const changPw = async (e) => {
        e.preventDefault();
        const response = await fetch('api/v1/modify-password',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userKey: formData.userKey})
        });

        if(response.ok) {
            const data = await response.json();
            const token = data.token

            window.location.href = `/changePw.do?token=${token}`;
            return;
        } else{
            alert("회원을 찾을 수 없습니다.");
        }
        window.location.href = '/changePw.do';
    }

    const deleteUser = async (e) => {
        e.preventDefault();
        if (window.confirm("정말 회원탈퇴를 하시겠습니까?")) {
            try {
                const response = await fetch("/api/v1/deleteUser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                if (response.ok) {
                    alert("회원탈퇴가 완료되었습니다.");
                    window.location.href = "/home.do";
                } else {
                    alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("회원탈퇴 중 오류 발생:", error);
                alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        }
    };

    if (isLoading || !formData) return <Loader />;

    return (
        <section>
            <div className="sec">
                {!isSocial && (
                <h1>회원정보수정</h1>
                    )}
                {isSocial && (
                    <h1>닉네임 변경</h1>
                )}
                <form>
                    <table>
                        <tbody>
                        {!isSocial && (
                            <>
                                <tr>
                                    <td>이메일</td>
                                    <td className="email-box">
                                        <input type="text" style={{ width: '130px' }}
                                               name="email1"
                                               value={formData.email1}
                                               onChange={handleChange}
                                        />
                                        <span style={{ margin: "0 3px" }}>@</span>
                                        <input type="text" style={{ width: '78px' }}
                                               name="email2"
                                               value={formData.email2}
                                               onChange={handleChange}
                                        />
                                        <select onChange={(e) => {
                                            setFormData({ ...formData, email2: e.target.value });
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
                                               onChange={handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>연락처</td>
                                    <td className="phonenum">
                                        <select onChange={(e) => {
                                            setFormData({ ...formData, phone1: e.target.value });
                                        }}>
                                            <option value="010">010</option>
                                            <option value="011">011</option>
                                            <option value="016">016</option>
                                            <option value="017">017</option>
                                            <option value="018">018</option>
                                            <option value="019">019</option>
                                        </select>
                                        <span style={{ margin: "0 6px" }}>-</span>
                                        <input type="text" style={{ width: '100px' }}
                                               name="phone2"
                                               value={formData.phone2}
                                               onChange={handleChange} />
                                        <span style={{ margin: "0 6px" }}>-</span>
                                        <input type="text" style={{ width: '100px' }}
                                               name="phone3"
                                               value={formData.phone3}
                                               onChange={handleChange} />
                                    </td>
                                </tr>
                            </>
                        )}
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
                            {!isSocial && (
                                <tr>
                                <td>
                                    <a onClick={changPw} className="del-mem" style={{ color: 'blue' }}>비밀번호 변경</a>
                                </td>
                                    <td>
                                        <a onClick={deleteUser} className="del-mem">회원탈퇴</a>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </form>

                <div className="modify-btn">
                    <button type="submit" onClick={handleSubmit}>정보수정</button>
                </div>
            </div>
        </section>
    );
}
