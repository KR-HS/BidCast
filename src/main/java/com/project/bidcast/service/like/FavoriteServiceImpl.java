package com.project.bidcast.service.like;

import com.project.bidcast.mapper.FavoriteMapper;
import com.project.bidcast.vo.AuctionScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    FavoriteMapper favoriteMapper;

    @Override
    public List<AuctionScheduleDTO> getLikedAuctionIds(int userKey) {
        return favoriteMapper.selectLikedAuctionsByUser(userKey);
    }

    @Override
    public void addLike(int userKey, int aucKey) {
        if (!favoriteMapper.existsFavorite(userKey, aucKey)) {
            favoriteMapper.insertLike(userKey, aucKey);
        }
    }

    @Override
    public void deleteLike(int userKey, int aucKey) {
        if (favoriteMapper.existsFavorite(userKey, aucKey)) {
            favoriteMapper.deleteLike(userKey, aucKey);
        }
    }
}
