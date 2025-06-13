package com.project.bidcast.mapper;

import com.project.bidcast.vo.UsersDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuthMapper {

    UsersDTO getUserByLoginId(String loginId);
    void createUser(String loginId, String userName, String birth, String phone, String email, String pw, String nickname);
}
