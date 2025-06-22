package com.project.bidcast.mapper;

import com.project.bidcast.vo.UsersDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AuthMapper {

    UsersDTO getUserByLoginId(String loginId);
    void createUser(UsersDTO user);
    UsersDTO searchId(String email, String userName, String phone);
    UsersDTO searchPw(String loginId, String email, String userName, String phone);
    void changePw(Integer userKey, String pw);

    @Select("SELECT pw AS password FROM users WHERE user_key = #{userKey}")
    String getPasswordById(int userKey);

    void updateUser(UsersDTO user);
    void deleteUser(Integer userKey);
}
