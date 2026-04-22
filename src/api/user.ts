import api from '../lib/axios';
import type { Team } from './team';

export interface UserProfile {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    class_room: string;
    avatar_url: string;
    points: number;
  };
  statistics: {
    modules_completed: number;
    missions_completed: number;
    total_missions: number;
    total_badges: number;
  };
  badges: any[];
  team: Team | null;
}

export const userService = {
  getProfile: async (): Promise<{ data: UserProfile }> => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateAvatar: async (formData: FormData) => {
    const response = await api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
