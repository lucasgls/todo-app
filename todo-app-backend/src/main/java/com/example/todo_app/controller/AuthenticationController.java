package com.example.todo_app.controller;

import com.example.todo_app.models.dtos.AuthenticatorDTO;
import com.example.todo_app.models.dtos.LoginResponseDTO;
import com.example.todo_app.models.dtos.RegisterDTO;
import com.example.todo_app.infra.security.TokenService;
import com.example.todo_app.models.User;
import com.example.todo_app.repositories.UserRepository;
import com.example.todo_app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authentication;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody AuthenticatorDTO data)
    {
        var token = userService.login(data);

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterDTO data)
    {
        userService.register(data);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
