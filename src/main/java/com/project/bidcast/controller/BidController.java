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


}
