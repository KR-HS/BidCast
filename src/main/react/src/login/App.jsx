import React from 'react'
export default function App() {
  return (
      <section>
          <div className="sec">
          <div>
              <img src="./img/logo.png" alt="Logo" width="200px" height="200px" />
          </div>
          <div className="ip-box">
              <input type="text" placeholder="아이디"

              />
              <br/>
              <input type="password"
                     placeholder="비밀번호"
              />
          </div>
          <div className="side-btn">
              <a href="#">아이디 찾기</a>|
              <a href="#">비밀번호 찾기</a>|
              <a href="#">회원가입</a>
          </div>
          <div>
              <button type="button">로그인</button>
          </div>
          </div>
      </section>
      )
}
