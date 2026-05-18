import { apiClient } from './client';
import { Task, TaskPriority, TaskStatusFilter } from '../types/task';

interface TaskFilters {
  search: string;
  status: TaskStatusFilter;
  priority: '' | TaskPriority;
  sortBy?: 'dueDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export const getTasks = async (filters: TaskFilters): Promise<PaginatedTasks> => {
  const params: Record<string, string | number> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status !== 'all') params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await apiClient.get('/api/tasks', { params });
  return {
    data: response.data.data,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
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
