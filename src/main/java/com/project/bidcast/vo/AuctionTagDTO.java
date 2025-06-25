package com.project.bidcast.vo;


import lombok.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AuctionTagDTO {

    // 클라이언트 경매 화면에서 다른 경매찍을때 
    private int auctionId;
    private String hostId;
    private Timestamp createdAt;
    private String title;
    private Timestamp startTime;
    private Timestamp endTime;
    private String status;
    private Integer viewCount;
    private Integer session;
    private String thumbnailUrl;
    List<String> tags;

    // 경매장 개설시 사용
    private Integer auctagKey;
    private Integer tagKey;
}
