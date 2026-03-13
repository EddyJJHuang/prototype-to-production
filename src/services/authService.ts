import api from './api';
import { mockUser, User } from '../data/mockUser';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK = true; // import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const login = async (credentials: any): Promise<{ user: User, token: string }> => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    const token = 'mock_jwt_token_123';
    localStorage.setItem('visahire_token', token);
    return { user: mockUser, token };
  }
  const res = await api.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
  if (res.data.token) {
    localStorage.setItem('visahire_token', res.data.token);
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('visahire_token');
  // Optional: Add api.post('/auth/logout') if backend requires it
  window.location.href = '/login';
};
