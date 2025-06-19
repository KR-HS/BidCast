package com.project.bidcast.mapper;

import com.project.bidcast.vo.UsersDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AuthMapper {

    UsersDTO getUserByLoginId(String loginId);
    void createUser(String loginId, String userName, String birth, String phone, String email, String pw, String nickname);
    UsersDTO searchId(String email, String userName, String phone);

    @Select("SELECT pw AS password FROM users WHERE user_key = #{userKey}")
    String getPasswordById(int userKey);
}