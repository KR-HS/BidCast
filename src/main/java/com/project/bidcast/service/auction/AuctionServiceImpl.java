package com.project.bidcast.service.auction;


import com.project.bidcast.mapper.AuctionMapper;
import com.project.bidcast.service.auth.AuthService;
import com.project.bidcast.util.S3UploadService;
import com.project.bidcast.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AuctionServiceImpl implements AuctionService {

    @Autowired
    private AuctionMapper auctionMapper;
    @Autowired
    private S3UploadService s3UploadService;

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

    @Override
    public List<AuctionScheduleDTO> getAuctionSchedule(String date, String tag) {
        List<AuctionScheduleDTO> scheduleTag = auctionMapper.selectAuctionSchedule(date, tag);
        System.out.println(scheduleTag);
        return scheduleTag;
    }

    public List<TagDTO> getTags() {

        return auctionMapper.selectTag();
    }

    //경매장 테이블 생성 후 경매장ID 반환
    @Override
    public Integer regAuction(AuctionDTO auctionDTO) {

        auctionMapper.regAuction(auctionDTO);
        return auctionDTO.getAuctionId();
    }


    //경매장에 대한 물품 등록
    @Override
    public void regProduct(Integer auctionId, List<Integer> tagKey,  List<String> itemNames, List<String> itemContent, MultipartFile[] images) {
        for(Integer tagKeyItem : tagKey) {
            AuctionTagDTO auctionTagDTO = AuctionTagDTO.builder()
                    .auctionId(auctionId)
                    .tagKey(tagKeyItem)
                    .build();
            auctionMapper.regAuctionTag(auctionTagDTO);
        }

        List<Integer> prodKeys = new ArrayList<>();

        for (int i = 0; i < itemNames.size(); i++) {
            ProdDTO prodDTO = ProdDTO.builder()
                    .aucKey(auctionId)
                    .prodName(itemNames.get(i))
                    .prodDetail(itemContent.get(i))
                    .build();
            auctionMapper.regProduct(prodDTO);
            prodKeys.add(prodDTO.getProdKey());
        }

        for (int i = 0; i < prodKeys.size(); i++) {
            FileDTO fileDTO = FileDTO.builder()
                    .aucKey(auctionId)
                    .fileUrl(s3UploadService.upload(images[i]))
                    .prodKey(prodKeys.get(i))
                    .build();
            auctionMapper.regAuctionImg(fileDTO);
        }
    }
}

