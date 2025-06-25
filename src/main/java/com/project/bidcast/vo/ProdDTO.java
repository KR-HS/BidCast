package com.project.bidcast.vo;


import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProdDTO {
    private int prodKey;
    private int aucKey;
    private String prodName;
    private String prodDetail;
    private int unitValue; // 경매단위
    private int initPrice;
    private Integer currentPrice; //
    private Integer finalPrice;
    private Integer winnerId;
    private char prodStatus;

    private String fileUrl;
}
