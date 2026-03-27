package com.example.app.token.repository;

import com.example.app.token.entity.TokenPurpose;
import com.example.app.token.entity.UserToken;
import com.example.app.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByTokenAndPurposeAndUsedFalse(String token, TokenPurpose purpose);
    void deleteByUserAndPurpose(User user, TokenPurpose purpose);
}
