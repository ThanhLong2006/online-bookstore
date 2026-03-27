package com.example.app.auth.service;

import com.example.app.auth.dto.AuthDtos;
import com.example.app.common.exception.AppException;
import com.example.app.mail.service.MailService;
import com.example.app.security.JwtService;
import com.example.app.token.entity.RefreshToken;
import com.example.app.token.entity.TokenPurpose;
import com.example.app.token.entity.UserToken;
import com.example.app.token.repository.RefreshTokenRepository;
import com.example.app.token.repository.UserTokenRepository;
import com.example.app.user.entity.Role;
import com.example.app.user.entity.User;
import com.example.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserTokenRepository userTokenRepository;
    private final MailService mailService;
    @Value("${app.jwt.refresh-token-days}")
    private long refreshDays;

    @Transactional
    public void register(AuthDtos.RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new AppException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = User.builder()
                .email(req.email().trim().toLowerCase())
                .fullName(req.fullName().trim())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(Role.USER)
                .emailVerified(false)
                .active(true)
                .build();
        userRepository.save(user);
        String verifyToken = issueUserToken(user, TokenPurpose.EMAIL_VERIFICATION, 1);
        mailService.send(user.getEmail(), "Verify your account", "Verification token: " + verifyToken);
        mailService.send(user.getEmail(), "Welcome", "Welcome to Secure Task API, " + user.getFullName());
    }

    @Transactional
    public void verifyEmail(String token) {
        UserToken userToken = userTokenRepository.findByTokenAndPurposeAndUsedFalse(token, TokenPurpose.EMAIL_VERIFICATION)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Invalid verification token"));
        if (userToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token expired");
        }
        User user = userToken.getUser();
        user.setEmailVerified(true);
        userToken.setUsed(true);
    }

    @Transactional
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!user.isEmailVerified()) {
            throw new AppException(HttpStatus.FORBIDDEN, "Email not verified");
        }
        String access = jwtService.generateAccessToken(user.getEmail(), Map.of("role", user.getRole().name(), "uid", user.getId()));
        String refresh = issueRefreshToken(user);
        return new AuthDtos.AuthResponse(access, refresh, "Bearer");
    }

    @Transactional
    public AuthDtos.AuthResponse refresh(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByTokenAndRevokedFalse(refreshToken)
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }
        User user = token.getUser();
        String access = jwtService.generateAccessToken(user.getEmail(), Map.of("role", user.getRole().name(), "uid", user.getId()));
        return new AuthDtos.AuthResponse(access, refreshToken, "Bearer");
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        refreshTokenRepository.findByTokenAndRevokedFalse(refreshToken).ifPresent(rt -> rt.setRevoked(true));
    }

    @Cacheable(cacheNames = "profile", key = "#email")
    public AuthDtos.ProfileResponse profile(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
        return new AuthDtos.ProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(), user.isEmailVerified());
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String token = issueUserToken(user, TokenPurpose.PASSWORD_RESET, 1);
            mailService.send(user.getEmail(), "Password reset", "Reset token: " + token);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        UserToken userToken = userTokenRepository.findByTokenAndPurposeAndUsedFalse(token, TokenPurpose.PASSWORD_RESET)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Invalid reset token"));
        if (userToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token expired");
        }
        userToken.getUser().setPasswordHash(passwordEncoder.encode(newPassword));
        userToken.setUsed(true);
    }

    private String issueRefreshToken(User user) {
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        refreshTokenRepository.save(RefreshToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plus(refreshDays, ChronoUnit.DAYS))
                .revoked(false)
                .build());
        return token;
    }

    private String issueUserToken(User user, TokenPurpose purpose, long expiryHours) {
        userTokenRepository.deleteByUserAndPurpose(user, purpose);
        byte[] bytes = new byte[36];
        new SecureRandom().nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        userTokenRepository.save(UserToken.builder()
                .token(token)
                .user(user)
                .purpose(purpose)
                .expiresAt(Instant.now().plus(expiryHours, ChronoUnit.HOURS))
                .used(false)
                .build());
        return token;
    }
}
