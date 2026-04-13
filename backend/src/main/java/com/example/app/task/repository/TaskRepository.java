package com.example.app.task.repository;

import com.example.app.task.entity.Task;
import com.example.app.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Override
    @EntityGraph(attributePaths = "owner")
    Optional<Task> findById(Long id);

    @EntityGraph(attributePaths = "owner")
    Page<Task> findByOwnerAndTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(
            User owner, String search, String status, Pageable pageable);

    @EntityGraph(attributePaths = "owner")
    Page<Task> findByTitleContainingIgnoreCaseAndStatusContainingIgnoreCase(
            String search, String status, Pageable pageable);
}
