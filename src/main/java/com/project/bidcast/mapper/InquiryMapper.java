package com.project.bidcast.mapper;

import com.project.bidcast.vo.InquiryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InquiryMapper {
    void registerInquiry(InquiryDTO inquiry);
    List<InquiryDTO> getAllInquiries();
    List<InquiryDTO> getInquiriesByUserKey(@Param("userKey") int userKey);
}
