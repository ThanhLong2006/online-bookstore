package com.example.app.task.repository;

import com.example.app.task.entity.Task;
import com.example.app.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwnerAndTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(
            User owner, String search, String status, Pageable pageable);

    Page<Task> findByTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(
            String search, String status, Pageable pageable);
}
