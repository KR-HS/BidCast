package com.project.bidcast.service.bid;

import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.mapper.BidMapper;
import com.project.bidcast.mapper.UserMapper;
import com.project.bidcast.vo.NickDTO;
import com.project.bidcast.vo.ProdDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BidServiceImpl implements BidService {

    @Autowired
    private BidMapper bidMapper;

    @Autowired
    private AuctionMapper auctionMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public String getAuctionStatus(int roomId) {
        return auctionMapper.getAuctionStatus(roomId);
    }

    @Override
    public List<ProdDTO> getProdList(int aucKey) {
        return bidMapper.getProdList(aucKey);
    }

    @Override
    public List<String> getTagList(int aucKey) {
        return bidMapper.getTagList(aucKey);
    }

    @Override
    public Map<Integer, String> getNicks() {
        List<NickDTO> result = userMapper.getNicks();

        Map<Integer, String> nickMap = new HashMap<>();
        for (NickDTO info : result) {
            nickMap.put(info.getUserKey(), info.getNickname());
        }

        return nickMap;
    }

    @Override
    public int unitUpdate(ProdDTO product) {
        return bidMapper.unitUpdate(product);
    }
}
