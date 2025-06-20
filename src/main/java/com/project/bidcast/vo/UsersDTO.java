package com.project.bidcast.vo;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.sql.Timestamp;

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
    private String nickName;
    private Timestamp createdAt;


}
