package com.example.app.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record RegisterRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 2, max = 120) String fullName,
            @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record VerifyEmailRequest(@NotBlank String token) {}
    public record RefreshTokenRequest(String refreshToken) {}
    public record ForgotPasswordRequest(@Email @NotBlank String email) {}
    public record ResetPasswordRequest(@NotBlank String token, @NotBlank @Pattern(regexp = "^.{8,72}$") String newPassword) {}

    public record AuthResponse(String accessToken, String refreshToken, String tokenType) {}
    public record ProfileResponse(Long id, String email, String fullName, String role, boolean emailVerified) {}
}
