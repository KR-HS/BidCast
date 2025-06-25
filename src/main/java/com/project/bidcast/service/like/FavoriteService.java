package com.project.bidcast.service.like;

import com.project.bidcast.vo.AuctionScheduleDTO;

import java.util.List;

public interface FavoriteService {
    List<AuctionScheduleDTO> getLikedAuctionIds(int userKey);
    void addLike(int userKey, int aucKey);
    void deleteLike(int userKey, int aucKey);
}
