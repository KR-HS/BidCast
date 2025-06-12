package com.project.bidcast.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTConfig {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String createToken(String id) {

        Algorithm algorithm = Algorithm.HMAC256(secret);
        long expireTime = System.currentTimeMillis() + expiration ;

        JWTCreator.Builder builder = JWT.create()
                .withSubject(id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(expireTime))
                .withIssuer("BidCastIssuer");

        return builder.sign(algorithm);
    }
}
