package com.project.bidcast.mapper;

import com.project.bidcast.vo.NickDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT user_key userKey,nickname FROM users")
    List<NickDTO> getNicks();

    @Select("SELECT EXISTS (SELECT 1 FROM users WHERE login_id =#{id}) as duplicate")
    Boolean isIdExists(String id);

}
