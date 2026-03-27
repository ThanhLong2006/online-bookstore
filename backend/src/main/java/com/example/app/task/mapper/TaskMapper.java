package com.example.app.task.mapper;

import com.example.app.task.dto.TaskDtos;
import com.example.app.task.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerEmail", source = "owner.email")
    TaskDtos.TaskResponse toResponse(Task task);
}
