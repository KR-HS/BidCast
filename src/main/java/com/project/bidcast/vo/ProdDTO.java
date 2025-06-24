package com.project.bidcast.vo;


import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProdDTO {
    int prodKey;
    int aucKey;
    String prodName;
    String prodDetail;
    int unitValue; // 경매단위
    int initPrice;
    Integer currentPrice; //
    Integer finalPrice;
    Integer winnerId;
    char prodStatus;
}
