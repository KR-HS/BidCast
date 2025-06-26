package com.project.bidcast.service.bid;

import com.project.bidcast.vo.AuctionTagDTO;
import com.project.bidcast.vo.ProdDTO;
import com.project.bidcast.vo.TagDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

public interface BidService {

    String getAuctionStatus(int roomId);
    String getAuctionTitle(int roomId);
    List<ProdDTO> getProdList(int aucKey);
    List<String> getTagList(int aucKey);
    Map<Integer,String> getNicks();
    int unitUpdate(ProdDTO dto);
  
    List<AuctionTagDTO> getOtherAuctions(int currentAuctionId);
}
