package com.project.bidcast.mapper;

import com.project.bidcast.vo.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoticeMapper {
    @Select("SELECT title FROM notice")
    List<NoticeDTO> getAllNoticeTitles();
}
