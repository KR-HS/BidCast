package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AuctionDetailDTO {

    private Integer auctionId;               // 경매장 고유번호
    private String session;              // 회차 (예: "1회차")
    private String title;                // 경매장 제목
    private List<String> tags;           // 태그 목록
    private String auctioneer;           // 경매사 이름
    private String date;                 // 진행일자(시작/종료일)
    private String startTime; // ISO 8601 형식 추천 (예: "2025-06-20T10:00:00")
    private String endTime;// ISO 8601 형식 추천 (예: "2025-06-20T15:00:00")
    private String status;
    private int itemCount;               // 경매장 내 상품 개수
    private List<AuctionItemDTO> items;  //
}
