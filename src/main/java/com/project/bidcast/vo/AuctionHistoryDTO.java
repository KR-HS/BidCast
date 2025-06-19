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
    private String imgUrl;
}
