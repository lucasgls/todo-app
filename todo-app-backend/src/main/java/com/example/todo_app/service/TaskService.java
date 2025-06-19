package com.example.todo_app.service;

import com.example.todo_app.models.Task;
import com.example.todo_app.models.User;
import com.example.todo_app.models.dtos.TaskCreateDTO;
import com.example.todo_app.models.dtos.TaskUpdateDTO;
import com.example.todo_app.models.enums.Status;
import com.example.todo_app.repositories.TaskRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    private User getCurrentAuthenticatedUser()
    {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<Task> findTasksForUser()
    {
        User user = getCurrentAuthenticatedUser();

        return taskRepository.findAllByUser_Id(user.getId());
    }

    public Task createTask(@NotNull TaskCreateDTO taskCreate)
    {
        User currentUser = getCurrentAuthenticatedUser();

        Task task = new Task();
        task.setTitle(taskCreate.title());
        task.setDescription(taskCreate.description());
        task.setPriority(taskCreate.priority());

        if (taskCreate.dueDate() != null){
            task.setData(taskCreate.dueDate().atStartOfDay());
        }

        task.setStatus(Status.Fazer);
        task.setUser(currentUser);

        return taskRepository.save(task);
    }

    public Task updateTask(TaskUpdateDTO taskUpdate, Long taskId) throws AccessDeniedException {
        User currentUser = getCurrentAuthenticatedUser();
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o id " + taskId));

        if (!task.getUser().getId().equals(currentUser.getId()))
        {
            throw new AccessDeniedException("Acesso Negado. Esta tarefa não lhe pertence.");
        }

        if (taskUpdate.title() != null){ task.setTitle(taskUpdate.title()); }
        if (taskUpdate.description() != null){ task.setDescription(taskUpdate.description()); }
        if (taskUpdate.priority() != null){ task.setPriority(taskUpdate.priority()); }
        if (taskUpdate.status() != null){ task.setStatus(taskUpdate.status()); }
        if (taskUpdate.dueDate() != null){ task.setData(taskUpdate.dueDate().atStartOfDay()); }

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) throws AccessDeniedException {
        User currentUser = getCurrentAuthenticatedUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new RuntimeException("Tarefa não encontrada com o id " + taskId));
        if (!task.getUser().getId().equals(currentUser.getId()))
        {
            throw new AccessDeniedException("Acesso negado. Esta tarefa não lhe pertence.");
        }

        taskRepository.delete(task);
    }

}
