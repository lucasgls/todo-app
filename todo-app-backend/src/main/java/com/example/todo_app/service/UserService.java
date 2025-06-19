package com.example.todo_app.service;

import com.example.todo_app.models.dtos.AuthenticatorDTO;
import com.example.todo_app.models.dtos.RegisterDTO;
import com.example.todo_app.models.User;
import com.example.todo_app.models.dtos.UserMeResponseDTO;
import com.example.todo_app.models.dtos.UserResponseDTO;
import com.example.todo_app.repositories.TaskRepository;
import com.example.todo_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.todo_app.infra.security.TokenService;
import java.util.List;
import java.util.Optional;

@Service
public class UserService
{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    private User getCurrentAuthenticatedUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<User> findAll() { return userRepository.findAll(); }

    public Optional<User> findById(Long id) { return userRepository.findById(id); }

    public UserMeResponseDTO getAuthenticatedUserProfile()
    {
        User currentUser = getCurrentAuthenticatedUser();

        return new UserMeResponseDTO(currentUser.getId(), currentUser.getUsername(), currentUser.getEmail(), currentUser.getRole());
    }

    public void register(RegisterDTO data)
    {
        if (userRepository.findByUsername(data.username()).isPresent())
        {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(data.email()).isPresent())
        {
            throw new RuntimeException("Email already exists");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(data.password());

        User newUser = new User();

        newUser.setUsername(data.username());
        newUser.setEmail(data.email());
        newUser.setPassword(encodedPassword);
        newUser.setRole("ROLE_USER");
        newUser.setEnabled(true);

        userRepository.save(newUser);
    }

    public String login(AuthenticatorDTO data)
    {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);

        return tokenService.generateToken((User) auth.getPrincipal());
    }

}
