package com.project.bidcast.vo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProdDTO {
    int prodKey;
    int aucKey;
    String prodName;
    String prodDetail;
    int initPrice;
    Integer finalPrice;
    Integer winnderId;
}
