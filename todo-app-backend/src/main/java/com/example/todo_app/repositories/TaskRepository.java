package com.example.todo_app.repositories;

import com.example.todo_app.models.Task;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>
{

    List<Task> findAllByUser_Id(Long userId);
    @NotNull Optional<Task> findById(Long taskId);
    Optional<Task> findByUser_Id(Long userId);
    List<Task> findByUserId(Long userId);
}
