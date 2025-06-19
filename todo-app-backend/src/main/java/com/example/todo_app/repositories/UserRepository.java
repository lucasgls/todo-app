package com.example.todo_app.repositories;

import com.example.todo_app.models.Task;
import com.example.todo_app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{


    Optional findByEmail(String email);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
}
