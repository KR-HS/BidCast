import React, {useEffect, useState} from 'react'
import Loader from "../../Loader/Loader";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
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
                }, 1000); // CSS transition과 동일 시간
            }

        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const [id, setId] = useState('');
    const [pw, setPw] = useState();


    //로그인 상태 확인
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
                    // console.log('Not authenticated');
                }
            } catch (error) {
                // console.error('Error checking login status:', error);
            }
        };
        checkLogin();

    }, []);

    //네이버로그인 초기화
    useEffect(() => {

        const checkNaverLoginCallback = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const naverCode = urlParams.get('code');
            const naverState = urlParams.get('state');

            if (naverCode && naverState) {
                // console.log("네이버 로그인 콜백 감지:", naverCode);
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
                // console.log('네이버 SDK 로드 완료');
                initNaverLogin();
            };
            script.onerror = (e) => {
                // console.error('네이버 SDK 로드 실패:', e);
            };
            document.head.appendChild(script);
        };

        loadNaverSDK();



        const initNaverLogin = () => {
            try {
                if (window.naver) {
                    const naverLogin = new window.naver.LoginWithNaverId({
                        clientId: "jofTdxFhK3nCE5655eYo",
                        callbackUrl: "https://bidcast.kro.kr/login.do", // 현재 페이지로 변경
                        isPopup: false,
                        loginButton: { color: "green", type: 3, height: 40 }
                    });
                    naverLogin.init();

                    // 콜백으로 돌아왔을 때 인증 처리
                    naverLogin.getLoginStatus(function(status) {
                        if (status) {
                            // 사용자 정보 얻기
                            const id = naverLogin.user.id;
                            const email = naverLogin.user.email;
                            const name = naverLogin.user.name;
                            const nickName = naverLogin.user.nickname;
                            const birthday = naverLogin.user.birthday;
                            const birthyear = naverLogin.user.birthyear;
                            const mobile = naverLogin.user.mobile;

                            // console.log("네이버 로그인 성공:", email, name, nickName, birthyear, birthday, mobile);

                            // 백엔드로 로그인 정보 전송
                            handleNaverLogin(id,email, name, nickName, birthyear, birthday, mobile);
                        }
                    });

                    // console.log('네이버 로그인 초기화 성공');
                } else {
                    // console.error('window.naver 객체가 존재하지 않음');
                }
            } catch (error) {
                // console.error('네이버 로그인 초기화 중 오류:', error);
            }
        };


        }, []);


    //네이버로그인
    const handleNaverLogin = async (id, email, name, nickName, birthyear, birthday, mobile) => {
        try {
            const response = await fetch("https://bidcast.kro.kr/api/v1/social-login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, email, name, nickName, birthyear, birthday, mobile })
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("네이버 로그인 서버 응답:", data);

                // 로그인 성공 후 처리 (예: 홈페이지로 리다이렉트)
                window.location.href = "/home.do";
            } else {
                // console.error("네이버 로그인 처리 실패");
            }
        } catch (error) {
            // console.error("네이버 로그인 요청 오류:", error);
        }
    };

    //구글로그인
    const handleGoogleLogin = async (response) => {
        try{
            const credential = response.credential;

            if(!credential) {
                // console.error("credential이 없습니다. 구글 로그인 실패");
                return;
            }
            const decoded = jwtDecode(credential);
            const{
                sub: id,
                email,
                name
            } =decoded;

            const res = await fetch("https://bidcast.kro.kr/api/v1/social-login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, email, name })
            });

            if (res.ok) {
                const data = await res.json();
                // console.log("구글 로그인 서버 응답:", data);

                // 로그인 성공 후 처리 (예: 홈페이지로 리다이렉트)
                window.location.href = "/home.do";
            } else {
                // console.error("구글 로그인 처리 실패");
            }
        } catch (error) {
            // console.error("구글 로그인 요청 오류:", error);
        }
    };


    //로그인버튼
    const loginBtn = async (e) => {
        e.preventDefault();

        if(!id || !pw) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }
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
            // console.log("로그인 응답 상태:", response.status);
        }
    } catch (error) {
        // console.error("로그인 요청 실패:", error);
    }}




  return (
      <section>
          {isLoading && <Loader/>}
          <div className="sec">
          <div>
              <img src="/img/logo.png" alt="Logo" width="200px" height="200px" />
          </div>
              <form onSubmit={loginBtn}>
          <div className="ip-box">
              <input type="text" placeholder="아이디"
                    value={id}
                    onChange={(e) => {
                        setId(e.target.value);
                    }}
                     onKeyDown={(e)=>{
                         if(e.key === 'Enter') {
                             loginBtn(e);//
                         }
                     }}
                     required
              />
              <br/>
              <input type="password"
                     placeholder="비밀번호"
                     value={pw}
                     onChange={(e) => {
                         setPw(e.target.value);
                     }}
                     onKeyDown={(e)=>{
                         if(e.key === 'Enter') {
                             loginBtn(e);//
                         }
                     }}
                     required
              />
          </div>
              </form>
          <div className="side-btn">
              <a href="/searchId.do">아이디 찾기</a>|
              <a href="/searchPw.do">비밀번호 찾기</a>|
              <a href="/join.do">회원가입</a>
          </div>
          <div className="login-btn-group">
              <button type="submit"
                      className="login-btn"
                      onClick={loginBtn}
              >로그인</button>
              <div className="social-login">
              <div id="naverIdLogin">

              </div>

                  <div className="google-login">
                  <GoogleLogin
                      onSuccess={(response) => handleGoogleLogin(response)}
                      onError={()=> console.log("로그인 실패")}
                  />
                  </div>
              </div>
          </div>
          </div>
      </section>
      )
}
