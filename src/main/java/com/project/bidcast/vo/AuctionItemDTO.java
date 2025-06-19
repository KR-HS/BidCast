package com.project.bidcast.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionItemDTO {

    private int prodId;            // 물품번호
    private String prodName;       // 물품명
    private String image;      // 이미지 URL
    private int price;         // 낙찰가
    private String winner;     // 낙찰자(닉네임/이름)
}
