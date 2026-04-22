import api from '../lib/axios';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    full_name: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getClasses: async (): Promise<string[]> => {
    const response = await api.get('/auth/classes');
    return response.data.classes;
  }
};
