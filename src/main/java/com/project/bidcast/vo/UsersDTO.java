package com.project.bidcast.vo;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class UsersDTO {

    private int userKey;
    private String loginId;
    private String userName;
    private String birth;
    private String phone;
    private String grade;
    private String email;
    private String pw;
    private String nickname;


}
