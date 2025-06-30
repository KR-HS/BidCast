package com.project.bidcast.controller;


import com.project.bidcast.service.auction.AuctionService;
import com.project.bidcast.service.auth.CustomUserDetails;

import com.project.bidcast.util.GetSession;

import com.project.bidcast.util.S3UploadService;
import com.project.bidcast.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
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
    @Autowired
    private S3UploadService s3UploadService;

    @GetMapping("/top6")
    public List<AuctionDTO> getFirst6AuctionsByDate(@RequestParam String date) {
        List<AuctionDTO> auctions = auctionService.getFirst6ByStartTimeAndDate(date);
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
        System.out.println(authentication.getPrincipal());
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userKey = userDetails.getUser().getUserKey();

        return auctionService.getWinningProductsByUserKey(userKey);
    }

    @GetMapping("/schedule")
    public List<AuctionScheduleDTO> getAuctionSchedule(@RequestParam(required = true) String date,
                                                       @RequestParam(required = false) String tag) {
        return auctionService.getAuctionSchedule(date, tag);
    }

    //태그 전체 조회
    @GetMapping("/tags")
    public List<TagDTO> getTags() {
        return auctionService.getTags();
    }

    //경매등록
    @Transactional
    @PostMapping(value = "/regAuction", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerAuction(
            @RequestParam("title") String title,
            @RequestParam("startTime")
            @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
            LocalDateTime startTime,
            @RequestParam(value = "tags", required = false) List<Integer> tags,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("images") MultipartFile[] images,
            @RequestPart("items") List<ProdDTO> products
//            @RequestParam("itemNames") List<String> itemNames,
//            @RequestParam("content") List<String> content
    ) {

        System.out.println("등록상품목록 : "+products.toString());
        System.out.println("thumbnail file name: " + thumbnail.getOriginalFilename());
        System.out.println("thumbnail content type: " + thumbnail.getContentType());
        System.out.println("thumbnail size: " + thumbnail.getSize());

        System.out.println("이미지 배열 크기: " + images.length);

        for (int i = 0; i < images.length; i++) {
            MultipartFile image = images[i];
            System.out.println("이미지 " + i + " 파일명: " + image.getOriginalFilename());
            System.out.println("이미지 " + i + " 타입: " + image.getContentType());
            System.out.println("이미지 " + i + " 사이즈: " + image.getSize());
        }
        try {
            String loginId = GetSession.getLoginId();

            AuctionDTO auctionDTO = AuctionDTO.builder()
                    .hostId(loginId)
                    .title(title)
                    .startTime(startTime)
                    .thumbnailUrl(s3UploadService.upload(thumbnail))
                    .build();
            /*경매장 생성*/

            //경매회차등록
            Integer auctionId = auctionService.regAuction(auctionDTO);
            //경매 태그, 상품 등록
//            auctionService.regProduct(auctionId, tags, itemNames, content, images);
            auctionService.regProduct(auctionId, tags, products, images);

            return ResponseEntity.ok(Map.of("success", true));
        }
        catch (Exception e) {
            e.printStackTrace();  // or log.error(...)
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public List<AuctionDTO> getAuctionsByPage(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String title
    ) {
        int offset = page * size;
        return auctionService.getAuctionsByPageAndFilter(offset, size, status, title);
    }




}


