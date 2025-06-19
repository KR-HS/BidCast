package com.project.bidcast.service.inquiry;

import com.project.bidcast.mapper.InquiryMapper;
import com.project.bidcast.vo.InquiryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryService {
    @Autowired
    private InquiryMapper inquiryMapper;

    public void registerInquiry(InquiryDTO inquiry) {
        // 등록 시 reply 기본값 설정
        inquiry.setReply("답변대기");
        inquiryMapper.registerInquiry(inquiry);
    }
    public List<InquiryDTO> getAllInquiries() {
        return inquiryMapper.getAllInquiries();
    }

    public List<InquiryDTO> getInquiriesByUserKey(int userKey) {
        return inquiryMapper.getInquiriesByUserKey(userKey);
    }

}
