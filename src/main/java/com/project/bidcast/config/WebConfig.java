package com.project.bidcast.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/bundle/**")
                .addResourceLocations("classpath:/static/bundle/")
                .setCachePeriod(3600); // 캐시 허용 (선택)npm
    }
}
