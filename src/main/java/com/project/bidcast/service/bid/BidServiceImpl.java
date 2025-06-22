package com.project.bidcast.service.bid;

import com.project.bidcast.mapper.BidMapper;
import com.project.bidcast.vo.ProdDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    @Autowired
    private BidMapper bidMapper;


    @Override
    public List<ProdDTO> getProdList(int aucKey) {
        return bidMapper.getProdList(aucKey);
    }

    @Override
    public List<String> getTagList(int aucKey) {
        return bidMapper.getTagList(aucKey);
    }

    @Override
    public int unitUpdate(ProdDTO product) {
        return bidMapper.unitUpdate(product);
    }
}
