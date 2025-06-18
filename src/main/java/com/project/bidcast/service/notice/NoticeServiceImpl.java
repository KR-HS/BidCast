package com.project.bidcast.service.notice;

import com.project.bidcast.mapper.NoticeMapper;
import com.project.bidcast.vo.NoticeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Override
    public List<NoticeDTO> getAllNoticeTitles() {
        return noticeMapper.getAllNoticeTitles();
    }

    @Override
    public NoticeDTO getNoticeById(Integer id) {
        return noticeMapper.getNoticeById(id);
    }

}
