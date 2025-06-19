package com.example.todo_app.controller;

import com.example.todo_app.models.Task;
import com.example.todo_app.models.dtos.TaskCreateDTO;
import com.example.todo_app.models.dtos.TaskResponseDTO;
import com.example.todo_app.models.dtos.TaskUpdateDTO;
import com.example.todo_app.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        var tasks = taskService.findTasksForUser();

        List<TaskResponseDTO> responseDTOs = tasks.stream()
                .map(task -> new TaskResponseDTO(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getPriority(),
                        task.getData(),
                        task.getStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody @Valid TaskCreateDTO task)
    {
        Task createdTask = taskService.createTask(task);
        TaskResponseDTO responseDTO = new TaskResponseDTO(
                createdTask.getId(), createdTask.getTitle(),
                createdTask.getDescription(), createdTask.getPriority(),
                createdTask.getData(), createdTask.getStatus()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> uptadeTask(@RequestBody @Valid TaskUpdateDTO task,@PathVariable Long taskId) throws AccessDeniedException {
        Task updateTask = taskService.updateTask(task, taskId);

        TaskResponseDTO responseDTO = new TaskResponseDTO(
                updateTask.getId(), updateTask.getTitle(),
                updateTask.getDescription(), updateTask.getPriority(),
                updateTask.getData(), updateTask.getStatus()
        );

        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) throws AccessDeniedException {
        taskService.deleteTask(taskId);

        return ResponseEntity.noContent().build();
    }

}
