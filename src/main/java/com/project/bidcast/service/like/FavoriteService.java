package com.project.bidcast.service.like;

import java.util.List;

public interface FavoriteService {
    List<Integer> getLikedAuctionIds(int userKey);
    void addLike(int userKey, int aucKey);
    void deleteLike(int userKey, int aucKey);
}
