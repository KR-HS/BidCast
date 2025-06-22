package com.project.bidcast.service.bid;

import com.project.bidcast.vo.ProdDTO;

import java.util.List;

public interface BidService {

    List<ProdDTO> getProdList(int aucKey);
    int unitUpdate(ProdDTO dto);
}
