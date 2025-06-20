package com.project.bidcast.service.auth;

import com.project.bidcast.mapper.AuthMapper;
import com.project.bidcast.util.GetSession;
import com.project.bidcast.vo.UsersDTO;
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

    @Override
    public UsersDTO searchId(Map<String, String> userInfo) {

        String email = userInfo.get("email1") + "@" + userInfo.get("email2");
        String name = userInfo.get("name");
        String phoneNumber = userInfo.get("phone1") + "-" + userInfo.get("phone2") + "-" + userInfo.get("phone3");
        return authMapper.searchId(email, name, phoneNumber);
    }
    @Override
    public UsersDTO searchPw(Map<String, String> userInfo) {

        String id = userInfo.get("id");
        String email = userInfo.get("email1") + "@" + userInfo.get("email2");
        String name = userInfo.get("name");
        String phoneNumber = userInfo.get("phone1") + "-" + userInfo.get("phone2") + "-" + userInfo.get("phone3");

        return authMapper.searchPw(id, email, name, phoneNumber);
    }

    @Override
    public void changePw(Map<String, String> userInfo) {

        Integer userKey = Integer.parseInt(userInfo.get("userKey"));
        String pw = passwordEncoder.encode(userInfo.get("pw"));

        authMapper.changePw(userKey, pw);
    }


    @Override
    public UsersDTO getUserByLoginId(String loginId) {
        return authMapper.getUserByLoginId(loginId);
    }

    @Override
    public boolean checkPassword(int userKey, String inputPassword) {
        String hashedPassword = authMapper.getPasswordById(userKey);
        // BCrypt 등 해시 비교
        return passwordEncoder.matches(inputPassword, hashedPassword);
    }

    @Override
    public void updateUser(Map<String, String> userInfo) {
        UsersDTO user = GetSession.getUser();

        String birth = userInfo.get("birth");
        String email = userInfo.get("email1") + "@" + userInfo.get("email2");
        String nickName = userInfo.get("nickName");
        String phone = userInfo.get("phone1") + "-" + userInfo.get("phone2") + "-" + userInfo.get("phone3");

        user.setBirth(birth);
        user.setEmail(email);
        user.setPhone(phone);
        user.setNickName(nickName);
        authMapper.updateUser(user);

    }

    @Override
    public void deleteUser(Integer userKey) {
        authMapper.deleteUser(userKey);

    }
}
