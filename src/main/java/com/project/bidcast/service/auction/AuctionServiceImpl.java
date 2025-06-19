package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.vo.AuctionDTO;
import com.project.bidcast.vo.AuctionDetailDTO;
import com.project.bidcast.vo.AuctionHistoryDTO;
import com.project.bidcast.vo.AuctionItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    @Autowired
    private AuctionMapper auctionMapper;

    @Override
    public List<AuctionDTO> getFirst6ByStartTime() {
        return auctionMapper.getFirst6ByStartTime();
    }

    @Override
    public List<AuctionHistoryDTO> getAuctionHistoryByUserId(String loginId) {
        List<AuctionHistoryDTO> list = auctionMapper.getAuctionHistoryByUserId(loginId);
        System.out.println(list);
        return list;
    }

    @Override
    public AuctionDetailDTO getAuctionDetail(Integer auctionId) {
        AuctionDetailDTO detail = auctionMapper.selectAuctionDetail(auctionId);
        List<AuctionItemDTO> items = auctionMapper.selectAuctionItemsByAuctionId(auctionId);
        detail.setItems(items);
        return detail;
    }

    @Override
    public List<AuctionItemDTO> getWinningProductsByUserKey(Integer userKey) {
        List<AuctionItemDTO> winnerItems = auctionMapper.selectWinningProductsByUserId(userKey);
        System.out.println(winnerItems);
        return winnerItems ;
    }
}

