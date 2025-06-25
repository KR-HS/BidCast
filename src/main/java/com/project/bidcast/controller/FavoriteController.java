package com.project.bidcast.controller;

import com.project.bidcast.service.like.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    FavoriteService favoriteService;

    @GetMapping("/{userKey}")
    public List<Integer> getLikedAuctionIds(@PathVariable int userKey) {
        return favoriteService.getLikedAuctionIds(userKey);
    }

    @PostMapping("/like")
    public void likeAuction(@RequestParam int userKey, @RequestParam int aucKey) {
        favoriteService.addLike(userKey, aucKey);
    }

    @DeleteMapping("/like")
    public void unlikeAuction(@RequestParam int userKey, @RequestParam int aucKey) {
        favoriteService.deleteLike(userKey, aucKey);
    }

}
