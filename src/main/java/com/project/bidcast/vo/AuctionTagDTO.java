package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuctionTagDTO {

    int auctionId;
    String hostId;
    Timestamp createdAt;
    String title;
    Timestamp startTime;
    Timestamp endTime;
    String status;
    Integer viewCount;
    Integer session;
    String thumbnailUrl;


    List<String> tags;
}
