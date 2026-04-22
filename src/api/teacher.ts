import api from '../lib/axios';

export interface TeacherStats {
  statistics: {
    total_students: number;
    total_teams: number;
    pending_grading: number;
  };
  needs_attention: any[];
}

export const teacherService = {
  getDashboardStats: async (): Promise<TeacherStats> => {
    const response = await api.get('/teacher/dashboard');
    return response.data.data;
  },

  getTeamsManagement: async (): Promise<{ data: any[] }> => {
    const response = await api.get('/teacher/teams-management');
    return response.data;
  },

  getStudentsManagement: async (): Promise<{ data: any[] }> => {
    const response = await api.get('/teacher/students-management');
    return response.data;
  },

  deleteStudent: async (studentId: string): Promise<any> => {
    const response = await api.delete(`/teacher/students/${studentId}`);
    return response.data;
  },

  awardBadge: async (studentId: string, badgeId: string): Promise<any> => {
    const response = await api.post(`/teacher/students/${studentId}/award-badge`, { badgeId });
    return response.data;
  }
};
