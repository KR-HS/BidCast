package com.project.bidcast.controller;


import com.project.bidcast.service.bid.BidService;
import com.project.bidcast.vo.AuctionTagDTO;
import com.project.bidcast.vo.ProdDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("fetch/auction")
public class BidController {


    @Autowired
    private BidService bidService;


    @PostMapping("/auction-status")
    public String getAuctionStatus(@RequestBody Map<String,Object> map) {
        System.out.println("경매상태가져오기");
        int roomId = Integer.parseInt(map.get("roomId").toString());

        String result = bidService.getAuctionStatus(roomId);

        System.out.println("경매 결과:"+result);
        return result;
    }

    @PostMapping("auction-title")
    public String getAuctionTItle(@RequestBody Map<String,Object> map){
        int roomId = Integer.parseInt(map.get("roomId").toString());

        String result = bidService.getAuctionTitle(roomId);

        return result;
    }

    @PostMapping("/prodList")
    @ResponseBody
    public List<ProdDTO> getProducts(@RequestBody Map<String, Object> map) {
        int roomId = Integer.parseInt(map.get("roomId").toString());

        return bidService.getProdList(roomId);
    }

    @PostMapping("/tagList")
    @ResponseBody
    public List<String> getTags(@RequestBody Map<String, Object> map) {
        int roomId = Integer.parseInt(map.get("roomId").toString());

        return bidService.getTagList(roomId);
    }

    @PostMapping("/nickList")
    @ResponseBody
    public Map<Integer,String> getNicks() {
        Map<Integer,String> result = bidService.getNicks();

        System.out.println("닉네임 불러오기 결과");
        System.out.println(result.toString());
        return result;
    }

    @PostMapping("/unitChange")
    @ResponseBody
    public String unitChange(@RequestBody ProdDTO product) {
        System.out.println("경매 ID: " + product.getAucKey());
        System.out.println("상품 ID: " + product.getProdKey());
        System.out.println("변경할 단위: " + product.getUnitValue());

        if(bidService.unitUpdate(product)<1) return "단위변경 실패";

        return "단위변경 성공";
    }

    @PostMapping("/otherAuctions")
    @ResponseBody
    public List<AuctionTagDTO> otherAuctions(@RequestBody Map<String, Object> map) {
        int auctionId = Integer.parseInt(map.get("auctionId").toString());
        return bidService.getOtherAuctions(auctionId);
    }

}
