package com.project.bidcast.mapper;

import com.project.bidcast.vo.AuctionScheduleDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    void insertLike(@Param("userKey") int userKey, @Param("auc_key") int aucKey);
    void deleteLike(@Param("userKey") int userKey, @Param("auc_key") int aucKey);
    boolean existsFavorite(@Param("userKey") int userKey, @Param("auc_key") Integer aucKey);
    List<Integer> selectLikedAuctionsIdsByUser(int userKey);
    List<AuctionScheduleDTO> selectLikedAuctionsByUser(int userKey);

}
