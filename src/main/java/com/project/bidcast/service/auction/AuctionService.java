package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.vo.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


public interface AuctionService {

   List<AuctionDTO> getFirst6ByStartTime();
   List<AuctionHistoryDTO> getAuctionHistoryByUserId(String loginId);
   AuctionDetailDTO getAuctionDetail(Integer auctionId);
   List<AuctionItemDTO> getWinningProductsByUserKey(Integer userKey);

   List<AuctionScheduleDTO>  getAuctionSchedule(String date,String tag);

   List<TagDTO> getTags();
    void regAuction(AuctionDTO auctionDTO);

}
