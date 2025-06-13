package com.project.bidcast.service.auth;

import com.project.bidcast.mapper.AuthMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthMapper authMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void createUser(Map<String, String> userInfo) {
        String id = userInfo.get("id");
        String pw = passwordEncoder.encode(userInfo.get("pw"));// 암호화된 비밀번호로 저장
        String email = userInfo.get("email1") + "@" + userInfo.get("email2");
        String name = userInfo.get("name");
        String birthday = userInfo.get("birthday");
        String phoneNumber = userInfo.get("phone1") + "-" + userInfo.get("phone2") + "-" + userInfo.get("phone3");
        String nickName = userInfo.get("nickName");
        authMapper.createUser(id, name, birthday, phoneNumber, email, pw, nickName);
    }


}
