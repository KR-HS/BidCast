package com.project.bidcast.mapper;


import com.project.bidcast.vo.AuctionDTO;
import com.project.bidcast.vo.AuctionDetailDTO;
import com.project.bidcast.vo.AuctionHistoryDTO;
import com.project.bidcast.vo.AuctionItemDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;


@Mapper
public interface AuctionMapper {

    @Select("SELECT auction_id AS auctionId, title, created_at AS createdAt, start_time AS startTime ,end_time AS endTime FROM auction ORDER BY start_time ASC LIMIT 6")
    List<AuctionDTO> getFirst6ByStartTime();
    // Mapper 인터페이스
    List<AuctionHistoryDTO> getAuctionHistoryByUserId(@Param("loginId") String loginId);

    AuctionDetailDTO selectAuctionDetail(Integer auctionId);

    List<AuctionItemDTO> selectAuctionItemsByAuctionId(Integer auctionId);

    List<AuctionItemDTO> selectWinningProductsByUserId(Integer userKey);

}


