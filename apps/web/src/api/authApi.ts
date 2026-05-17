import { apiClient } from './client';
import { AuthUser } from '../types/auth';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const registerUser = async (payload: { name: string; email: string; password: string }): Promise<void> => {
  await apiClient.post('/api/auth/register', payload);
};

export const loginUser = async (payload: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login', payload);
  return response.data;
};
