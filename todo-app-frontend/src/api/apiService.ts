import type { Task, TaskCreateData, TaskUpdateData, UserProfile } from '../types/types';

export const apiService = {
  async login(username: string, password: string): Promise<string> {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Falha no login. Verifique as suas credenciais.');
    const data = await response.json();
    return data.token;
  },

  async getProfile(token: string): Promise<UserProfile> {
    const response = await fetch('http://localhost:8080/users/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao obter o perfil.');
    return response.json();
  },

  async getTasks(token: string): Promise<Task[]> {
    const response = await fetch('http://localhost:8080/tasks', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao carregar as tarefas.');
    return response.json();
  },

  async createTask(token: string, taskData: TaskCreateData): Promise<Task> {
    const requestData = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority,
      dueDate: taskData.dueDate || null
    };
    const response = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Falha ao criar a tarefa.');
    return response.json();
  },

  async updateTask(token: string, taskId: number, updateData: Partial<Task>): Promise<Task> {
    const requestData: TaskUpdateData = {};
    if (updateData.title !== undefined) requestData.title = updateData.title;
    if (updateData.description !== undefined) requestData.description = updateData.description;
    if (updateData.priority !== undefined) requestData.priority = updateData.priority;
    if (updateData.data !== undefined) requestData.dueDate = updateData.data;
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Falha ao atualizar a tarefa.');
    return response.json();
  },

  async deleteTask(token: string, taskId: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Falha ao apagar a tarefa.');
  },

  async getUsers(token: string): Promise<UserProfile[]> {
    const response = await fetch('http://localhost:8080/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao carregar usuários.');
    return response.json();
  },

  async getUserById(token: string, id: number): Promise<UserProfile> {
    const response = await fetch(`http://localhost:8080/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Falha ao carregar usuário.');
    return response.json();
  },

  async register(username: string, email: string, password: string): Promise<void> {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao registrar.');
    }
  },
}; 