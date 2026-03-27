package com.example.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SecureTaskApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecureTaskApiApplication.class, args);
    }
}
