package com.example.todo_app.models.dtos;

import com.example.todo_app.models.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskCreateDTO(
        @NotBlank @Size(max = 50)String title,
        @NotBlank @Size(max = 250) String description,
        Priority priority,
        LocalDate dueDate

) {}
