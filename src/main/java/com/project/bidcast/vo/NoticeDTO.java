package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NoticeDTO {
    private Integer noticeKey;
    private Integer userKey;
    private String title;
    private String content;
    private Integer viewCount;
    private LocalDateTime regDate;

}
