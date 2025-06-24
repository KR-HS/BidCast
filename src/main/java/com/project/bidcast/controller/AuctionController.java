package com.project.bidcast.controller;


import com.project.bidcast.service.auction.AuctionService;
import com.project.bidcast.service.auth.CustomUserDetails;

import com.project.bidcast.util.GetSession;

import com.project.bidcast.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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


    @GetMapping("/schedule")
    public List<AuctionScheduleDTO> getAuctionSchedule(@RequestParam(required = true) String date,
                                                       @RequestParam(required = false) String tag) {
        return auctionService.getAuctionSchedule(date, tag);

    @GetMapping("/tags")
    public List<TagDTO> getTags() {
        return auctionService.getTags();

    }

    @PostMapping(value = "/regAuction", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerAuction(
            @RequestParam("title") String title,
            @RequestParam("startTime") LocalDateTime startTime,
            @RequestParam("endTime") LocalDateTime endTime,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestPart("images") List<MultipartFile> images,
            @RequestParam("itemNames") List<String> itemNames
    ) {
        AuctionDTO auctionDTO = new AuctionDTO();

        Integer userKey = GetSession.getUserKey();

        auctionDTO.builder()
                .hostId(userKey)
                .title(title)
                .startTime(startTime)
                .endTime(endTime)
                .build();



        System.out.println("title = " + title);
        System.out.println("startTime = " + startTime);
        System.out.println("endTime = " + endTime);
        System.out.println("tags = " + tags);
        System.out.println("itemNames = " + itemNames);
        System.out.println("images count = " + images.size());
        System.out.println("images = " + images);

        return ResponseEntity.ok(Map.of("success", true));
    }

}

