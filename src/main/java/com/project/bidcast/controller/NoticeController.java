package com.project.bidcast.controller;

import com.project.bidcast.service.notice.NoticeService;
import com.project.bidcast.vo.NoticeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    @GetMapping
    public List<NoticeDTO> getAllNotices() {
        return noticeService.getAllNoticeTitles();
    }


}
