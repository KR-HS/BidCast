package com.project.bidcast.componenet;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class AuthService {

    //jwt 발급
    private static String secret = "BidCastSecKey!@";
    public static String createToken(String id) {

        Algorithm algorithm = Algorithm.HMAC256(secret);
        long expireTime = System.currentTimeMillis() + 3600000;

        JWTCreator.Builder builder = JWT.create()
                .withSubject(id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(expireTime))
                .withIssuer("BidCastIssuer");

        return builder.sign(algorithm);
    }


    // 비밀번호 암호화
    @Autowired
    private PasswordEncoder passwordEncoder;
    public void registerUser(String password){
        String encodedPassword = passwordEncoder.encode(password);
        password = encodedPassword; // 암호화된 비밀번호로 저장
        System.out.println(password);
    }
}
