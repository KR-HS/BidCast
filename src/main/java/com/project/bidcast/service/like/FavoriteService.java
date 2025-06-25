package com.project.bidcast.service.like;

import com.project.bidcast.vo.AuctionScheduleDTO;

import java.util.List;

public interface FavoriteService {
    void addLike(int userKey, int aucKey);
    void deleteLike(int userKey, int aucKey);
    List<Integer> getLikedAuctionIds(int userKey);
    List<AuctionScheduleDTO> getLikedAuctions(int userKey);
}
