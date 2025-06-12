package com.project.bidcast.controller;


import com.project.bidcast.componenet.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("api/v1")
public class AuthController {

    @Autowired
    private AuthService jwtService;


    //회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, String> userInfo) {
        String id = userInfo.get("id");
        String pw = userInfo.get("pw");
        String email = userInfo.get("email1") + "@" + userInfo.get("email2");
        String name = userInfo.get("name");
        String birthday = userInfo.get("birthday");
        String phoneNumber = userInfo.get("phone1") + "-" + userInfo.get("phone2") + "-" + userInfo.get("phone3");
        String nickName = userInfo.get("nickName");

        jwtService.registerUser(pw);

        System.out.println("회원가입 정보: " + userInfo);

        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }

    //로그인
    @CrossOrigin("*")
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam("id") String id,
                                                     @RequestParam("pw") String pw,
                                                     HttpSession session) {
        if (!id.isBlank() && !pw.isBlank()) {
            if (id.equals("db에서가져올값") && pw.equals("1234")) {

                String token = AuthService.createToken(id);

                HashMap<String, String> map = new HashMap<>();
                map.put("token", token);
                map.put("username", "데이터!");

                session.setAttribute("id", id);
                session.setAttribute("token", token);
                session.setAttribute("pw", pw);

                System.out.println(session.getAttribute("id"));
                System.out.println(session.getAttribute("token"));

                return new ResponseEntity<>(map, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(Map.of("msg", "아이디 비밀번호를 확인하세요"), HttpStatus.UNAUTHORIZED);
    }

    //네이버로그인
    @CrossOrigin("*")
    @PostMapping("/naver-login")
    public ResponseEntity<Map<String, String>> naverLogin(@RequestBody Map<String, String> userInfo) {
        String email = userInfo.get("email");
        String name = userInfo.get("name");

        System.out.println(userInfo);
        // 이메일과 이름이 비어있지 않은지 확인
        if (email != null && !email.isBlank() && name != null && !name.isBlank()) {
            // 실제 구현에서는 이메일을 기반으로 DB에서 사용자 조회 또는 등록
            // 여기서는 간단히 토큰만 발급
            String token = AuthService.createToken(email);

            HashMap<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", name);
            response.put("email", email);
            System.out.println("이름:" + name);
            System.out.println("email:" + email);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>(Map.of("msg", "네이버 로그인 정보가 유효하지 않습니다"), HttpStatus.BAD_REQUEST);
    }


    //아이디찾기
    @PostMapping("/searchId")
    public ResponseEntity<?> searchId(@RequestBody Map<String, String> searchInfo) {
        String id = searchInfo.get("name");
        String email = searchInfo.get("email1") + "@" + searchInfo.get("email2");
        String phone = searchInfo.get("phone1") + "-" + searchInfo.get("phone2") + "-" + searchInfo.get("phone3");

        System.out.println(id + "" + email + "" + phone);
        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }

    //비밀번호 찾기
    @PostMapping("/searchPw")
    public ResponseEntity<?> searchPw(@RequestBody Map<String, String> searchInfo) {
        String id = searchInfo.get("id");
        String name = searchInfo.get("name");
        String email = searchInfo.get("email1") + "@" + searchInfo.get("email2");
        String phone = searchInfo.get("phone1") + "-" + searchInfo.get("phone2") + "-" + searchInfo.get("phone3");

        System.out.println(id + "" + name + "" + email + "" + phone);
        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }
}
