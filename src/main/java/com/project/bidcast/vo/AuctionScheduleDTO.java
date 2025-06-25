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
public class AuctionScheduleDTO {
    private Integer auctionId;
    private String date;        // "2025.06.20" 등
    private String title;
    private String image;
    private List<String> tags;  // 태그 여러 개 가능
    private String startTime;
    private String endTime;
    private String status;
    private int guestCount;
    private String hostName;
}
