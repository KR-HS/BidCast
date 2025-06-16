package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.vo.AuctionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    @Autowired
    private AuctionMapper auctionMapper;

    @Override
    public List<AuctionDTO> getFirst6ByStartTime() {
        return auctionMapper.getFirst6ByStartTime();
    }
}

