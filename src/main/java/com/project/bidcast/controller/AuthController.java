package com.project.bidcast.controller;


import com.project.bidcast.config.JWTConfig;
import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.vo.UsersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("api/v1")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    private JWTConfig jwtConfig;

    //회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, String> userInfo) {


        System.out.println("회원가입 정보: " + userInfo);

        authService.createUser(userInfo);

        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }

    @GetMapping("/auth/check")
    public ResponseEntity<?> checkLogin(Principal principal) {
        if (principal != null) {
            return ResponseEntity.ok().body("authenticated");
        } else {
            return ResponseEntity.status(401).body("unauthenticated");
        }
    }

    //로그인
    @CrossOrigin("*")
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam("id") String id,
                                                     @RequestParam("pw") String pw,
                                                     HttpSession session) {

        if (!id.isBlank() && !pw.isBlank()) {
            if(authService.getUserByLoginId(id, pw) == null) {
                return new ResponseEntity<>(Map.of("msg", "아이디 비밀번호를 확인하세요"), HttpStatus.UNAUTHORIZED);
            }else {
//                String token = jwtConfig.createToken(id);
//                HashMap<String, String> map = new HashMap<>();
//                map.put("token", token);
//                map.put("id", id);
                session.setAttribute("id", id);

                return new ResponseEntity<>(HttpStatus.OK);
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
            String token = jwtConfig.createToken(email);

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
