package com.project.bidcast.controller;


import com.project.bidcast.service.bid.BidService;
import com.project.bidcast.vo.ProdDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("fetch/auction")
public class BidController {


    @Autowired
    private BidService bidService;



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

    @PostMapping("/unitChange")
    @ResponseBody
    public String unitChange(@RequestBody ProdDTO product) {
        System.out.println("경매 ID: " + product.getAucKey());
        System.out.println("상품 ID: " + product.getProdKey());
        System.out.println("변경할 단위: " + product.getUnitValue());

        if(bidService.unitUpdate(product)<1) return "단위변경 실패";


        return "단위변경 성공";
    }

}
