package com.project.bidcast.util;

import com.project.bidcast.service.auth.CustomUserDetails;
import com.project.bidcast.vo.UsersDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class GetSession {

    // 현재 로그인된 사용자 전체 DTO 반환
    public static UsersDTO getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    public static Integer getUserKey() {
        UsersDTO user = getUser();
        return (user != null) ? user.getUserKey() : null;
    }

    // 로그인 ID만 반환
    public static String getLoginId() {
        UsersDTO user = getUser();
        return (user != null) ? user.getLoginId() : null;
    }

    // 사용자 이름 반환
    public static String getUserName() {
        UsersDTO user = getUser();
        return (user != null) ? user.getUserName() : null;
    }
}