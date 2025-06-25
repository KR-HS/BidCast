package com.project.bidcast.service.user;

import com.project.bidcast.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    private UserMapper userMapper;

    @Override
    public boolean isIdExists(String id) {
        return userMapper.isIdExists(id);
    }
}
