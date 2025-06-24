package com.project.bidcast.vo;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class AuctionTagDTO {
    private Integer auctagKey;
    private Integer tagKey;
    private Integer auctionId;
}
