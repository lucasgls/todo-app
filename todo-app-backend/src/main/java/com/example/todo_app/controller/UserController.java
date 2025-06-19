package com.example.todo_app.controller;

import com.example.todo_app.models.dtos.UserMeResponseDTO;
import com.example.todo_app.models.dtos.UserResponseDTO;
import com.example.todo_app.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService)
    {
        this.userService = userService;
    }
    @GetMapping("/me")
    public ResponseEntity<UserMeResponseDTO> getMyProfile()
    {
        UserMeResponseDTO userProfile = userService.getAuthenticatedUserProfile();

        return  ResponseEntity.ok(userProfile);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listarUsuarios()
    {
        var users = userService.findAll();

        List<UserResponseDTO> responseDTOs = users.stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<UserResponseDTO>> listarPorId(@PathVariable Long id)
    {
        var userId = userService.findById(id);

        List<UserResponseDTO> responseDTOS = userId.stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(responseDTOS);
    }
}
