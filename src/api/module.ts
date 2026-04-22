import api from '../lib/axios';

export interface Module {
  id: string;
  title: string;
  slug: string;
  video_url: string | null;
  pdf_url: string | null;
  category: 'KEWARGANEGARAAN' | 'BUDAYA';
  thumbnail_url: string | null;
}

export interface ModuleListItem {
  id: string;
  title: string;
  slug: string;
  category: 'KEWARGANEGARAAN' | 'BUDAYA';
  thumbnail_url: string | null;
  pdf_url: string | null;
  is_completed?: boolean;
}

export const moduleService = {
  getAllModules: async (category?: string): Promise<{ data: ModuleListItem[] }> => {
    const response = await api.get('/modules', {
      params: { category }
    });
    return response.data;
  },

  getModuleBySlug: async (slug: string): Promise<{ data: Module, is_complete: boolean }> => {
    const response = await api.get(`/modules/${slug}`);
    return response.data;
  },

  markAsComplete: async (moduleId: string): Promise<{ message: string }> => {
    const response = await api.post(`/modules/${moduleId}/complete`);
    return response.data;
  }
};
