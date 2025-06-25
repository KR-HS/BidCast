package com.project.bidcast.controller;

import com.project.bidcast.service.like.FavoriteService;
import com.project.bidcast.vo.AuctionScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    FavoriteService favoriteService;

    @PostMapping("/like")
    public void likeAuction(@RequestParam int userKey, @RequestParam int aucKey) {
        favoriteService.addLike(userKey, aucKey);
    }

    @DeleteMapping("/like")
    public void unlikeAuction(@RequestParam int userKey, @RequestParam int aucKey) {
        favoriteService.deleteLike(userKey, aucKey);
    }

    @GetMapping("/ids/{userKey}")
    public ResponseEntity<List<Integer>> getFavoriteAuctionIds(@PathVariable int userKey) {
       List<Integer> likedIds = favoriteService.getLikedAuctionIds(userKey);
       return ResponseEntity.ok(likedIds);
    }

    @GetMapping("/list/{userKey}")
    public ResponseEntity<List<AuctionScheduleDTO>> getFavoriteAuctions(@PathVariable int userKey) {

        List<AuctionScheduleDTO> list = favoriteService.getLikedAuctions(userKey);
        return ResponseEntity.ok(list);
    }

}
