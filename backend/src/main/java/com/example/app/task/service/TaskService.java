package com.example.app.task.service;

import com.example.app.common.exception.AppException;
import com.example.app.task.dto.TaskDtos;
import com.example.app.task.entity.Task;
import com.example.app.task.mapper.TaskMapper;
import com.example.app.task.repository.TaskRepository;
import com.example.app.user.entity.Role;
import com.example.app.user.entity.User;
import com.example.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper mapper;

    @Transactional(readOnly = true)
    public Page<TaskDtos.TaskResponse> list(String currentEmail, String search, String status, Pageable pageable) {
        User current = getUser(currentEmail);
        String keyword = search == null ? "" : search.trim();
        String statusFilter = status == null ? "" : status.trim();
        Page<Task> tasks = current.getRole() == Role.ADMIN
                ? taskRepository.findByTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(keyword, statusFilter, pageable)
                : taskRepository.findByOwnerAndTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(current, keyword, statusFilter, pageable);
        return tasks.map(mapper::toResponse);
    }

    @Transactional
    public TaskDtos.TaskResponse create(String currentEmail, TaskDtos.TaskRequest req) {
        User owner = getUser(currentEmail);
        Task task = taskRepository.save(Task.builder()
                .title(req.title().trim())
                .description(req.description())
                .status(req.status().trim().toUpperCase())
                .owner(owner)
                .build());
        return mapper.toResponse(task);
    }

    @Transactional
    public TaskDtos.TaskResponse update(String currentEmail, Long id, TaskDtos.TaskRequest req) {
        User current = getUser(currentEmail);
        Task task = taskRepository.findById(id).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Task not found"));
        if (current.getRole() != Role.ADMIN && !task.getOwner().getId().equals(current.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        task.setTitle(req.title().trim());
        task.setDescription(req.description());
        task.setStatus(req.status().trim().toUpperCase());
        return mapper.toResponse(task);
    }

    @Transactional
    public void delete(String currentEmail, Long id) {
        User current = getUser(currentEmail);
        Task task = taskRepository.findById(id).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Task not found"));
        if (current.getRole() != Role.ADMIN && !task.getOwner().getId().equals(current.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        taskRepository.delete(task);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
