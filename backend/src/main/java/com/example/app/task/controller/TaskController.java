package com.example.app.task.controller;

import com.example.app.task.dto.TaskDtos;
import com.example.app.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskDtos.TaskResponse>> list(
            Authentication auth,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(taskService.list(auth.getName(), search, status, pageable));
    }

    @PostMapping
    public ResponseEntity<TaskDtos.TaskResponse> create(Authentication auth, @Valid @RequestBody TaskDtos.TaskRequest req) {
        return ResponseEntity.ok(taskService.create(auth.getName(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDtos.TaskResponse> update(Authentication auth, @PathVariable Long id, @Valid @RequestBody TaskDtos.TaskRequest req) {
        return ResponseEntity.ok(taskService.update(auth.getName(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        taskService.delete(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
