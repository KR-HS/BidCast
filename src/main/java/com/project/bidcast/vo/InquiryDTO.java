package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InquiryDTO {
    private Integer inquiryKey;
    private Integer userKey;
    private String title;
    private String content;
    private String reply;
    private LocalDateTime createDate;
    private LocalDateTime replyDate;
    // getter, setter
}

