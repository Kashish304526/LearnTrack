import api from './api';
import type { Task, CreateTaskRequest } from '../types';

/**
 * Task service for managing tasks
 */
class TaskService {
  async getTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  }

  async createTask(taskData: CreateTaskRequest): Promise<void> {
    await api.post('/tasks', taskData);
  }

  async completeTask(taskId: number): Promise<void> {
    await api.patch(`/tasks/${taskId}/complete`);
  }

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }
  async updateTask(taskId: number, title: string): Promise<void> {
  await api.put(`/tasks/${taskId}`, { title });
  }

}
  
export default new TaskService();
