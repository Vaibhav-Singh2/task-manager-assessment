import { apiClient } from './client';
import { Task, TaskPriority, TaskStatusFilter } from '../types/task';

interface TaskFilters {
  search: string;
  status: TaskStatusFilter;
  priority: '' | TaskPriority;
}

export const getTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status !== 'all') params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;

  const response = await apiClient.get('/api/tasks', { params });
  return response.data.data;
};

export const createTask = async (payload: {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
}): Promise<Task> => {
  const response = await apiClient.post('/api/tasks', payload);
  return response.data.data;
};

export const updateTask = async (
  taskId: string,
  payload: Partial<{ title: string; description: string; priority: TaskPriority; dueDate: string; completed: boolean }>
): Promise<Task> => {
  const response = await apiClient.put(`/api/tasks/${taskId}`, payload);
  return response.data.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/api/tasks/${taskId}`);
};
