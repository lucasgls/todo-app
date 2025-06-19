package com.example.todo_app.config;

import com.example.todo_app.models.User;
import com.example.todo_app.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@todoapp.com");
            adminUser.setPassword(passwordEncoder.encode("senha000"));
            adminUser.setRole("ROLE_ADMIN");
            adminUser.setEnabled(true);

            userRepository.save(adminUser);
            System.out.println("Utilizador Administrador criado com sucesso!");
        }
    }
}