package com.project.bidcast.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuthMapper {


    void createUser(String loginId, String userName, String birth, String phone, String email, String pw, String nickname);
}
