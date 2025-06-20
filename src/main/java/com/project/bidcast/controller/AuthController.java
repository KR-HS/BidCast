package com.project.bidcast.controller;


import com.project.bidcast.config.JWTConfig;
import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.util.GetSession;
import com.project.bidcast.vo.UsersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
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

        authService.createUser(userInfo);

        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }

    //로그인할 시 로그인창으로 접속 안되게하는 컨트롤러
    @GetMapping("/auth/check")
    public ResponseEntity<?> checkLogin() {

        UsersDTO user = GetSession.getUser();
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인이 필요합니다."));
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/getUserInfo")
    public ResponseEntity<UsersDTO> getUserInfo(){
        UsersDTO user = GetSession.getUser();
        System.out.println(user.toString());
        return ResponseEntity.ok(user);
    }

//    //로그인
//    @CrossOrigin("*")
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, String>> login(@RequestParam("id") String id,
//                                                     @RequestParam("pw") String pw,
//                                                     HttpSession session) {
//
//        if (!id.isBlank() && !pw.isBlank()) {
//            if(authService.getUserByLoginId(id, pw) == null) {
//                return new ResponseEntity<>(Map.of("msg", "아이디 비밀번호를 확인하세요"), HttpStatus.UNAUTHORIZED);
//            }else {
////                String token = jwtConfig.createToken(id);
////                HashMap<String, String> map = new HashMap<>();
////                map.put("token", token);
////                map.put("id", id);
//                session.setAttribute("id", id);
//
//                return new ResponseEntity<>(HttpStatus.OK);
//            }
//        }
//        return new ResponseEntity<>(Map.of("msg", "아이디 비밀번호를 확인하세요"), HttpStatus.UNAUTHORIZED);
//    }

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

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>(Map.of("msg", "네이버 로그인 정보가 유효하지 않습니다"), HttpStatus.BAD_REQUEST);
    }


    //아이디찾기
    @PostMapping("/searchId")
    public ResponseEntity<?> searchId(@RequestBody Map<String, String> searchInfo) {
        UsersDTO dto = authService.searchId(searchInfo);
        if(dto == null) {
            return new ResponseEntity<>(Map.of("msg", "해당 정보로 가입된 회원이 없습니다."), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(Map.of("success", true,"user", dto), HttpStatus.OK);
    }

    //비밀번호 찾기
    @PostMapping("/searchPw")
    public ResponseEntity<?> searchPw(@RequestBody Map<String, String> searchInfo) {
        UsersDTO dto = authService.searchPw(searchInfo);

        if(dto ==null){
            return new ResponseEntity<>(Map.of("msg", "해당 정보로 가입된 회원이 없습니다."), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(Map.of("success", true, "user", dto), HttpStatus.OK);
    }

    //비밀번호변경
    @PostMapping("/changePw")
    public ResponseEntity<?> changePw(@RequestBody Map<String, String> changeInfo) {

        authService.changePw(changeInfo);
        return new ResponseEntity<>(Map.of("success", true), HttpStatus.OK);
    }

    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody Map<String, String> body) {
        String inputPassword = body.get("password");
        UsersDTO user = GetSession.getUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인이 필요합니다.","user", user));
        }

        // 실제 비밀번호 검증 (해시 비교)
        boolean match = authService.checkPassword(user.getUserKey(), inputPassword);
        if (match) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "msg", "비밀번호가 일치하지 않습니다."));
        }


    }

    //회원정보 수정
    @PostMapping("/memberModify")
    public ResponseEntity<?> memberModify(@RequestBody Map<String, String> userInfo) {

        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인이 필요합니다."));
        }

         authService.updateUser(userInfo);

        return ResponseEntity.ok(Map.of("success", true, "user", userInfo));
    }

    //회원탈퇴
    @PostMapping("/deleteUser")
    public ResponseEntity<?> deleteUser() {
        Integer userKey = GetSession.getUserKey();
        if (userKey == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("msg", "로그인이 필요합니다."));
        }
        SecurityContextHolder.clearContext();
        // 회원 탈퇴 로직
        authService.deleteUser(userKey);

        return ResponseEntity.ok(Map.of("success", true, "msg", "회원 탈퇴가 완료되었습니다."));
    }

}
