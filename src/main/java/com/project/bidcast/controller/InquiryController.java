package com.project.bidcast.controller;

import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.service.inquiry.InquiryService;
import com.project.bidcast.vo.InquiryDTO;
import com.project.bidcast.vo.UsersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class InquiryController {
    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private AuthService authService; // AuthService 주입

    // 1. ★ 여기 추가! 인증 체크 API ★
    @GetMapping("/api/inquiry/auth-check")
    public ResponseEntity<?> authCheck(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().build();
    }


    // 문의 등록 (로그인한 사용자만)
    @PostMapping("/api/inquiry")
    public ResponseEntity<?> registerInquiry(@RequestBody InquiryDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        String username = principal.getName();
        UsersDTO user = authService.getUserByLoginId(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 사용자입니다.");
        }
        dto.setUserKey(user.getUserKey());
        inquiryService.registerInquiry(dto);
        return ResponseEntity.ok("문의가 등록되었습니다.");
    }

    // 내 문의 목록 조회 (로그인한 사용자만)
    @GetMapping("/api/inquiryList")
    public ResponseEntity<List<InquiryDTO>> getMyInquiries(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = principal.getName();
        UsersDTO user = authService.getUserByLoginId(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        int userKey = user.getUserKey();
        List<InquiryDTO> myInquiries = inquiryService.getInquiriesByUserKey(userKey);
        return ResponseEntity.ok(myInquiries);
    }
}
