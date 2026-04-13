package com.example.app.auth.controller;

import com.example.app.auth.dto.AuthDtos;
import com.example.app.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @Value("${app.jwt.refresh-token-days}")
    private long refreshDays;
    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@Valid @RequestBody AuthDtos.VerifyEmailRequest req) {
        authService.verifyEmail(req.token());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest req, HttpServletResponse response) {
        AuthDtos.AuthResponse auth = authService.login(req);
        attachRefreshCookie(response, auth.refreshToken());
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthDtos.AuthResponse> refreshToken(
            @RequestBody(required = false) AuthDtos.RefreshTokenRequest req,
            HttpServletRequest request,
            HttpServletResponse response) {
        String token = req == null ? null : req.refreshToken();
        if ((token == null || token.isBlank()) && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        AuthDtos.AuthResponse auth = authService.refresh(token);
        attachRefreshCookie(response, auth.refreshToken());
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestBody(required = false) AuthDtos.RefreshTokenRequest req,
            HttpServletRequest request,
            HttpServletResponse response) {
        String token = req == null ? null : req.refreshToken();
        if ((token == null || token.isBlank()) && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        authService.logout(token);
        clearRefreshCookie(response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<AuthDtos.ProfileResponse> profile(Authentication authentication) {
        return ResponseEntity.ok(authService.profile(authentication.getName()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody AuthDtos.ForgotPasswordRequest req) {
        authService.forgotPassword(req.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody AuthDtos.ResetPasswordRequest req) {
        authService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.ok().build();
    }

    private void attachRefreshCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .sameSite("Strict")
                .maxAge(refreshDays * 24 * 3600)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
