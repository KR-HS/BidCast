package com.project.bidcast.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecConfig {

    //비밀번호 암호화
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    //웹페이지 필터
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // CSRF 보호 비활성화 (API 서버에서는 필요하지 않을 수 있음)

                //접근 권한 설정 (예: /home.do는 인증 없이 접근 가능)
                .authorizeHttpRequests()
                .antMatchers(
                        "/css/**",
                        "/js/**",
                        "/img/**",
                        "/bundle/**",
                        "/api/**",
                        "/home.do",
                        "/join.do",
                        "/**"

                ).permitAll()
                .anyRequest().authenticated()
                .and()

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // 로그인 및 로그아웃 설정
                .formLogin(form -> form
                        .loginPage("/login.do")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/home.do", true)
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
                        })
                        .permitAll() //
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 🔥 변경 필요
                        .logoutSuccessUrl("/home.do")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }
}
