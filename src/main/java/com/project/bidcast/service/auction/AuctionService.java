package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface AuctionService {

   List<AuctionDTO> getFirst6ByStartTimeAndDate(String date);
   List<AuctionHistoryDTO> getAuctionHistoryByUserId(String loginId);
   AuctionDetailDTO getAuctionDetail(Integer auctionId);
   List<AuctionItemDTO> getWinningProductsByUserKey(Integer userKey);

   List<AuctionScheduleDTO>  getAuctionSchedule(String date,String tag);

   List<TagDTO> getTags();
   Integer regAuction(AuctionDTO auctionDTO);
   void regProduct(Integer auctionId, List<Integer> tagKey, List<String> itemNames, List<String> itemContent, MultipartFile[] images);
}

