package com.project.bidcast.mapper;


import com.project.bidcast.vo.*;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;


@Mapper
public interface AuctionMapper {

    @Select("SELECT auction_id AS auctionId, title, created_at AS createdAt, start_time AS startTime, end_time AS endTime, status FROM auction WHERE to_char(start_time, 'YYYY.MM.DD') = #{date} ORDER BY start_time ASC LIMIT 6")
    List<AuctionDTO> getFirst6ByStartTimeAndDate(@Param("date") String date);

    // Mapper 인터페이스
    List<AuctionHistoryDTO> getAuctionHistoryByUserId(@Param("loginId") String loginId);

    AuctionDetailDTO selectAuctionDetail(Integer auctionId);

    List<AuctionItemDTO> selectAuctionItemsByAuctionId(Integer auctionId);

    List<AuctionItemDTO> selectWinningProductsByUserId(Integer userKey);


    List<AuctionScheduleDTO> selectAuctionSchedule(@Param("date") String date, @Param("tag") String tag);


    @Select("SELECT status FROM auction WHERE auction_id=#{auctionId}")
    String getAuctionStatus(int auctionId);

    @Select("SELECT title FROM auction WHERE auction_id=#{auctionId}")
    String getAuctionTitle(int auctionId);

    @Select("SELECT tag_key, tag_name FROM tag")
    List<TagDTO> selectTag();

    void regAuction(AuctionDTO auctionDTO);


    List<AuctionTagDTO> getOtherAuctions(int auctionId);

    @Insert("INSERT INTO auctiontag (auc_key, tag_key) VALUES (#{auctionId}, #{tagKey})")
    void regAuctionTag(AuctionTagDTO auctionTagDTO);

    void regProduct(ProdDTO prodDTO);

    @Insert("INSERT INTO file (auc_key, file_url, prod_key) VALUES (#{aucKey}, #{fileUrl}, #{prodKey})")
    void regAuctionImg(FileDTO fileDTO);

    List<AuctionDTO> selectAuctionsByPage(@Param("offset") int offset, @Param("size") int size);
    List<AuctionDTO> selectAuctionsByPageAndStatus(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("status") String status
    );
    List<AuctionDTO> selectAuctionsByPageAndFilter(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("status") String status,
            @Param("title") String title
    );

    List<AuctionDTO> searchAuctionsByTitle(@Param("keyword") String keyword);

    

}


