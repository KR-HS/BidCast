package com.project.bidcast.mapper;

import com.project.bidcast.vo.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoticeMapper {

    // 전체 공지사항 조회
    @Select("SELECT \n" +
            "        notice_key AS noticeKey,\n" +
            "        user_key AS userKey,\n" +
            "        title,\n" +
            "        content,\n" +
            "        view_count AS viewCount,\n" +
            "        reg_date AS regDate\n" +
            "    FROM notice\n" +
            "    ORDER BY notice_key DESC")
    List<NoticeDTO> getAllNoticeTitles();

    // 단일 공지사항 상세 조회
    @Select("SELECT \n" +
            "        notice_key AS noticeKey,\n" +
            "        user_key AS userKey,\n" +
            "        title,\n" +
            "        content,\n" +
            "        view_count AS viewCount,\n" +
            "        reg_date AS regDate\n" +
            "    FROM notice\n" +
            "    WHERE notice_key = #{id}")
    NoticeDTO getNoticeById(@Param("id") Integer id);
}
