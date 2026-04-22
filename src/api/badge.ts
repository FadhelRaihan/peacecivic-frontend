import api from '../lib/axios';

export interface Badge {
  id: string;
  badge_name: string;
  badge_icon_url: string;
  description: string;
}

export const badgeService = {
  getAllBadges: async (): Promise<{ data: Badge[] }> => {
    const response = await api.get('/badges');
    return response.data;
  },

  createBadge: async (formData: FormData) => {
    const response = await api.post('/badges', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteBadge: async (id: string) => {
    const response = await api.delete(`/badges/${id}`);
    return response.data;
  }
};
