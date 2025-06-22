package com.project.bidcast.service.auth;

import com.project.bidcast.vo.UsersDTO;

import java.util.Map;

public interface AuthService {

    void createUser(Map<String, String> userInfo);
    UsersDTO searchId(Map<String, String> userInfo);
    UsersDTO searchPw(Map<String, String> userInfo);
    void changePw(Map<String, String> userInfo);
    UsersDTO socialLogin(Map<String, String> userInfo);
    UsersDTO getUserByLoginId(String loginId);

    boolean checkPassword(int userKey, String inputPassword);

    void updateUser(Map<String, String> userInfo);
    void deleteUser(Integer userKey);
}
