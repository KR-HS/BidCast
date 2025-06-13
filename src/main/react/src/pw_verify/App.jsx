import React, {useState} from 'react'
export default function App() {

    const [pw, setPw] = useState('');

    const handleChange = (e) => {
        setPw( e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('api/v1/searchPw',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password:pw})
        });

        if(response.ok) {
            const data = await response.json();
            alert(`비밀번호는 입니다.`);
            window.location.href = '/findcomplete.do';
        } else{
            alert("회원을 찾을 수 없습니다.");
        }
    }


    return (
        <section>
            <div className="sec">
                <h1>
                    비밀번호 확인
                </h1>
                <div className="box">
                    <h3>
                        정보수정을 위해서 비밀번호 확인이 필요합니다.
                    </h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>비밀번호</td>
                            <td>
                                <input type="password"
                                       name="pw"
                                       value={pw}
                                       onChange={handleChange}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div>
                        <button type="button"
                                onClick={handleSubmit}
                        >확인</button>
                    </div>

                </div>
            </div>
        </section>
    )
}
