import api from './api';
import { AuthResponse } from '../types/auth';
import { User } from '../types/user';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  // PRD says POST /api/auth/login
  // But common FastAPI uses POST /token with form data.
  // We'll stick to PRD for now: POST /api/auth/login with JSON body.
  const response = await api.post<AuthResponse>('/api/auth/login', { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/me'); // Assuming standard endpoint
  return response.data;
};
