import api from '../lib/axios';

export interface Project {
  id: string;
  team_id: string;
  title: string;
  plan_file_url: string | null;
  report_files: string[];
  status: 'DRAFT' | 'PLAN_SUBMITTED' | 'PLAN_APPROVED' | 'REPORT_SUBMITTED' | 'COMPLETED';
  points_awarded: number | null;
  teacher_feedback: string | null;
  created_at: string;
  team?: {
    team_name: string;
  };
}

export const projectService = {
  // Get my team's projects (History + Active)
  getMyTeamProjects: async (): Promise<{ data: Project[] }> => {
    const response = await api.get('/projects/my-team');
    return response.data;
  },

  // Get active project if exists
  getActiveProject: async (): Promise<{ data: Project | null }> => {
    const response = await api.get('/projects/my-team');
    const projects = response.data.data as Project[];
    const active = projects.find(p => p.status !== 'COMPLETED');
    return { data: active || null };
  },

  // Submit Plan
  submitPlan: async (formData: FormData) => {
    const response = await api.post('/projects/submit-plan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Submit Report
  submitReport: async (projectId: string, formData: FormData) => {
    const response = await api.post(`/projects/${projectId}/submit-report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Teacher: Get all projects
  getAllProjects: async (): Promise<{ data: Project[] }> => {
    const response = await api.get('/projects/all');
    return response.data;
  },

  // Teacher: Approve Plan
  approvePlan: async (projectId: string) => {
    const response = await api.post(`/projects/${projectId}/approve-plan`);
    return response.data;
  },

  // Teacher: Finalize/Grade
  finalizeProject: async (projectId: string, data: { points: number; teacher_feedback?: string; missionId?: string; badgeId?: string }) => {
    const response = await api.post(`/projects/${projectId}/finalize`, data);
    return response.data;
  }
};
