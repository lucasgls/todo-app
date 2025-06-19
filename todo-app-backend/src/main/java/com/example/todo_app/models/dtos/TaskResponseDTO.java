package com.example.todo_app.models.dtos;

import com.example.todo_app.models.enums.Priority;
import com.example.todo_app.models.enums.Status;

import java.time.LocalDateTime;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        Priority priority,
        LocalDateTime data,
        Status status

) { }
