package com.example.app.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class TaskDtos {
    public record TaskRequest(
            @NotBlank @Size(max = 160) String title,
            @Size(max = 2000) String description,
            @NotBlank String status
    ) {}

    public record TaskResponse(
            Long id, String title, String description, String status,
            Long ownerId, String ownerEmail, Instant createdAt, Instant updatedAt
    ) {}
}
