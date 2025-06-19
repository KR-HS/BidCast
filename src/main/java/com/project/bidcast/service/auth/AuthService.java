package com.project.bidcast.service.auth;

import com.project.bidcast.vo.UsersDTO;

import java.util.Map;

public interface AuthService {

    void createUser(Map<String, String> userInfo);
    UsersDTO searchId(Map<String, String> userInfo);
    boolean checkPassword(int userKey, String inputPassword);
}
