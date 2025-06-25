package com.project.bidcast.vo;


import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
public class AuctionDTO {

        private Integer auctionId;
        private String title;
        private LocalDateTime createdAt;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String status;
        private Integer viewCount;
        private String hostId;
        private String thumbnailUrl;
        private String hostName;



}
