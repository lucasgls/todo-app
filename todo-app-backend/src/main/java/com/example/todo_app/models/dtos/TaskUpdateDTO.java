package com.example.todo_app.models.dtos;

import com.example.todo_app.models.enums.Priority;
import com.example.todo_app.models.enums.Status;

import java.time.LocalDate;

public record TaskUpdateDTO (
        String title,
        String description,
        Priority priority,
        LocalDate dueDate,
        Status status
) {}
