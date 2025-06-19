package com.example.todo_app.models.dtos;

public record UserMeResponseDTO (
        Long id,
        String username,
        String email,
        String role
){
}
