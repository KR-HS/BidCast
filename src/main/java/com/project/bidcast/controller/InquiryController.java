package com.project.bidcast.controller;

import com.project.bidcast.service.inquiry.InquiryService;
import com.project.bidcast.vo.InquiryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InquiryController {
    @Autowired
    private InquiryService inquiryService;

    @PostMapping("/api/inquiry")
    public ResponseEntity<?> registerInquiry(@RequestBody InquiryDTO inquiry) {
        inquiryService.registerInquiry(inquiry);
        return ResponseEntity.ok("등록 성공");
    }

    @GetMapping("/api/inquiryList")
    public ResponseEntity<List<InquiryDTO>> getInquiryList() {
        List<InquiryDTO> inquiries = inquiryService.getAllInquiries();
        return ResponseEntity.ok(inquiries);
    }
}