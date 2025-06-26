package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuctionHistoryDTO {

    private Integer auctionId;
    private String title;
    private String image;
    private Integer session;   // 회차
    private String startTime;       // 경매 시작 시간 (상태 계산용)
    private String endTime; // 경매 종료 시간 (상태 계산용)
    private String status;
    private String auctionDate;     // 경매 일자 (created_at, 표시용)
}



