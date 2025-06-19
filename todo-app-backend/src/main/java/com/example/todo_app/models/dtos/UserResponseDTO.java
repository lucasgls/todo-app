package com.example.todo_app.models.dtos;

public record UserResponseDTO(
        Long id,
        String username,
        String email,
        String role

) {
}
