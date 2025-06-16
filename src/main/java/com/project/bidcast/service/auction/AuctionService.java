package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.vo.AuctionDTO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


public interface AuctionService {

   List<AuctionDTO> getFirst6ByStartTime();

}
