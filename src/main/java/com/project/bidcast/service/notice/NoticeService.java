package com.project.bidcast.service.notice;

import com.project.bidcast.vo.NoticeDTO;

import java.util.List;

public interface NoticeService {

    List<NoticeDTO> getAllNoticeTitles();
    NoticeDTO getNoticeById(Integer id);

}
