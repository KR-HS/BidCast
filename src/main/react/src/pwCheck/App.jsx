import React, {useEffect, useState} from "react";
import Loader from "../Loader/Loader";

export default function App() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 서버에 비밀번호 확인 요청
        const res = await fetch("/api/v1/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
            credentials: "include"
        });

        const result = await res.json();

        if (result.success) {
           window.location.href="/memberModify.do";
        } else {
            alert("비밀번호가 일치하지 않습니다.")
        }
    };

    if (isLoading) {
        return (
           <Loader />
        );
    }
    return (
        <div className="password-check-container">
            <h1>비밀번호 확인</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    비밀번호
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">확인</button>
            </form>
            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}
