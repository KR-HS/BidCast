package com.project.bidcast.controller;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.service.auction.AuctionService;
import com.project.bidcast.vo.AuctionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    AuctionService auctionService;


    @GetMapping("/top5")
    public List<AuctionDTO> getFirst6Auctions() {
        System.out.println("데이터" + auctionService.toString());
        return auctionService.getFirst6ByStartTime();
    }
}

