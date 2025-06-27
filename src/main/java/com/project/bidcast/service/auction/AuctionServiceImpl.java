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
    public List<AuctionDTO> getFirst6ByStartTimeAndDate(String date) {
        return auctionMapper.getFirst6ByStartTimeAndDate(date);
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
        System.out.println("물품"+items.toString());
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

    @Override
    public void regProduct(Integer auctionId, List<Integer> tagKey, List<ProdDTO> products, MultipartFile[] images) {

        for(Integer tagKeyItem : tagKey) {
            AuctionTagDTO auctionTagDTO = AuctionTagDTO.builder()
                    .auctionId(auctionId)
                    .tagKey(tagKeyItem)
                    .build();
            auctionMapper.regAuctionTag(auctionTagDTO);
        }

        List<Integer> prodKeys = new ArrayList<>();

        for(ProdDTO prodDTO : products) {
            prodDTO.setAucKey(auctionId);
            auctionMapper.regProduct(prodDTO);
            prodKeys.add(prodDTO.getProdKey());

            System.out.println("상품등록완료 : "+prodKeys.toString());
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


    //경매장에 대한 물품 등록
//    @Override
//    public void regProduct(Integer auctionId, List<Integer> tagKey,  List<String> itemNames, List<String> itemContent, MultipartFile[] images) {
//        for(Integer tagKeyItem : tagKey) {
//            AuctionTagDTO auctionTagDTO = AuctionTagDTO.builder()
//                    .auctionId(auctionId)
//                    .tagKey(tagKeyItem)
//                    .build();
//            auctionMapper.regAuctionTag(auctionTagDTO);
//        }
//
//        List<Integer> prodKeys = new ArrayList<>();
//
//        for (int i = 0; i < itemNames.size(); i++) {
//            ProdDTO prodDTO = ProdDTO.builder()
//                    .aucKey(auctionId)
//                    .prodName(itemNames.get(i))
//                    .prodDetail(itemContent.get(i))
//                    .build();
//            auctionMapper.regProduct(prodDTO);
//            prodKeys.add(prodDTO.getProdKey());
//        }
//
//        for (int i = 0; i < prodKeys.size(); i++) {
//            FileDTO fileDTO = FileDTO.builder()
//                    .aucKey(auctionId)
//                    .fileUrl(s3UploadService.upload(images[i]))
//                    .prodKey(prodKeys.get(i))
//                    .build();
//            auctionMapper.regAuctionImg(fileDTO);
//        }
//    }

    @Override
    public List<AuctionDTO> getAuctionsByPage(int offset, int size) {
        return auctionMapper.selectAuctionsByPage(offset, size);
    }
    @Override
    public List<AuctionDTO> getAuctionsByPageAndStatus(int offset, int size, String status) {
        return auctionMapper.selectAuctionsByPageAndStatus(offset, size, status);
    }
    @Override
    public List<AuctionDTO> getAuctionsByPageAndFilter(int offset, int size, String status, String title) {
        return auctionMapper.selectAuctionsByPageAndFilter(offset, size, status, title);
    }

    @Override
    public List<AuctionDTO> searchAuctionsByTitle(String keyword) {
        return auctionMapper.searchAuctionsByTitle(keyword);
    }



}

