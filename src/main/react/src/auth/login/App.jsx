import React, {useEffect, useState} from 'react'
export default function App() {

    const [id, setId] = useState('');
    const [pw, setPw] = useState();


    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch('/api/v1/auth/check', {
                    method: 'GET',
                    credentials: 'include', // 쿠키를 포함해서 보내기
                });

                if (response.ok) {
                    window.location.href="/home.do";
                } else {
                    console.log('Not authenticated');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLogin();

    }, []);


    useEffect(() => {

        const checkNaverLoginCallback = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const naverCode = urlParams.get('code');
            const naverState = urlParams.get('state');

            if (naverCode && naverState) {
                console.log("네이버 로그인 콜백 감지:", naverCode);
                // 이미 naverLogin.getLoginStatus에서 처리되므로
                // 여기서는 추가 작업이 필요 없을 수 있음
            }
        };

        checkNaverLoginCallback();




        const loadNaverSDK = () => {
            // 이미 로드된 경우 건너뛰기
            if (document.getElementById('naver-login-sdk')) {
                initNaverLogin();
                return;
            }

            // 스크립트 동적 생성
            const script = document.createElement('script');
            script.id = 'naver-login-sdk';
            script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
            script.charset = 'utf-8';
            script.onload = () => {
                console.log('네이버 SDK 로드 완료');
                initNaverLogin();
            };
            script.onerror = (e) => {
                console.error('네이버 SDK 로드 실패:', e);
            };
            document.head.appendChild(script);
        };

        loadNaverSDK();

        const initNaverLogin = () => {
            try {
                if (window.naver) {
                    const naverLogin = new window.naver.LoginWithNaverId({
                        clientId: "jofTdxFhK3nCE5655eYo",
                        callbackUrl: "http://localhost:8888/login.do", // 현재 페이지로 변경
                        isPopup: false,
                        loginButton: { color: "green", type: 3, height: 40 }
                    });
                    naverLogin.init();

                    // 콜백으로 돌아왔을 때 인증 처리
                    naverLogin.getLoginStatus(function(status) {
                        if (status) {
                            // 사용자 정보 얻기
                            const email = naverLogin.user.email;
                            const name = naverLogin.user.name;
                            const nickName = naverLogin.user.nickname;
                            const birthday = naverLogin.user.birthday;
                            const birthyear = naverLogin.user.birthyear;
                            const mobile = naverLogin.user.mobile;

                            console.log("네이버 로그인 성공:", email, name, nickName, birthyear, birthday, mobile);

                            // 백엔드로 로그인 정보 전송
                            handleNaverLogin(email, name, nickName, birthyear, birthday, mobile);
                        }
                    });

                    console.log('네이버 로그인 초기화 성공');
                } else {
                    console.error('window.naver 객체가 존재하지 않음');
                }
            } catch (error) {
                console.error('네이버 로그인 초기화 중 오류:', error);
            }
        };


    }, []);

    const handleNaverLogin = async (email, name, nickName, birthyear, birthday, mobile) => {
        try {
            const response = await fetch("http://localhost:8888/api/v1/naver-login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, nickName, birthyear, birthday, mobile })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("네이버 로그인 서버 응답:", data);

                // 로그인 성공 후 처리 (예: 홈페이지로 리다이렉트)
                window.location.href = "/home.do";
            } else {
                console.error("네이버 로그인 처리 실패");
            }
        } catch (error) {
            console.error("네이버 로그인 요청 오류:", error);
        }
    };

    const handleId = (e) => {
        setId(e.target.value);
        console.log(id);
    }

    const handlePw = (e) => {
        setPw(e.target.value);
        console.log(pw);
    }

    const loginBtn = async (e) => {
        e.preventDefault();

        //값 보내기
        const formData = new URLSearchParams();
        formData.append("username", id);
        formData.append("password", pw);

        try{
            const response = await fetch("/login",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData,
                credentials: "include"
            })
        if(response.redirected){
            window.location.href = response.url;
        }else if (response.status === 401) {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        } else {
            console.log("로그인 응답 상태:", response.status);
        }
    } catch (error) {
        console.error("로그인 요청 실패:", error);
    }}


    const logoutHandler = async () => {
        const response = await fetch("/logout", {
            method: "POST",
            credentials: "include", // 쿠키 전달
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            window.location.href = "/login.do"; // 또는 원하는 경로
        }
    };




  return (
      <section>
          <div className="sec">
          <div>
              <img src="./img/logo.png" alt="Logo" width="200px" height="200px" />
          </div>
              <form onSubmit={loginBtn}>
          <div className="ip-box">
              <input type="text" placeholder="아이디"
                    value={id}
                    onChange={handleId}
                     onKeyDown={(e)=>{
                         if(e.key === 'Enter') {
                             loginBtn(e);//
                         }
                     }}
              />
              <br/>
              <input type="password"
                     placeholder="비밀번호"
                     value={pw}
                     onChange={handlePw}
                     onKeyDown={(e)=>{
                         if(e.key === 'Enter') {
                             loginBtn(e);//
                         }
                     }}
              />
          </div>
              </form>
          <div className="side-btn">
              <a href="searchid.do">아이디 찾기</a>|
              <a href="searchpw.do">비밀번호 찾기</a>|
              <a href="join.do">회원가입</a>
          </div>
          <div>
              <button type="submit"
                      className="login-btn"
                      onClick={loginBtn}
              >로그인</button>
          </div>

              <div id="naverIdLogin"></div>

          </div>
          <button onClick={logoutHandler}>로그아웃</button>
      </section>
      )
}
