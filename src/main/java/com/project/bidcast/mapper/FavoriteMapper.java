package com.project.bidcast.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    List<Integer> selectLikedAuctionIdsByUser(@Param("userKey") int userKey);
    void insertLike(@Param("userKey") int userKey, @Param("auc_key") int aucKey);
    void deleteLike(@Param("userKey") int userKey, @Param("auc_key") int aucKey);
    boolean existsFavorite(@Param("userKey") int userKey, @Param("auc_key") Integer aucKey);

}
