package com.project.bidcast.controller;


import com.project.bidcast.service.auction.AuctionService;
import com.project.bidcast.service.auth.CustomUserDetails;
import com.project.bidcast.vo.AuctionDTO;
import com.project.bidcast.vo.AuctionDetailDTO;
import com.project.bidcast.vo.AuctionHistoryDTO;
import com.project.bidcast.vo.AuctionItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    AuctionService auctionService;


    @GetMapping("/top6")
    public List<AuctionDTO> getFirst6Auctions() {
        List<AuctionDTO> auctions = auctionService.getFirst6ByStartTime();
        System.out.println("Top6 리스트: " + auctions);
        return auctions;
    }

    @GetMapping("/history")
    public List<AuctionHistoryDTO> getHistoryAuctions(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            // 인증이 안 된 경우
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
            // 또는 return ResponseEntity.status(401).build();
        }
        String loginId = authentication.getName();
        return auctionService.getAuctionHistoryByUserId(loginId);
    }


    @GetMapping("/auctionDetail/{auctionId}")
    public AuctionDetailDTO getAuctionDetail(@PathVariable Integer auctionId) {
        return auctionService.getAuctionDetail(auctionId);
    }

    @GetMapping("/winning-history")
    public List<AuctionItemDTO> getWinningHistoryAuctions(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userKey = userDetails.getUser().getUserKey();

        return auctionService.getWinningProductsByUserKey(userKey);
    }



}

