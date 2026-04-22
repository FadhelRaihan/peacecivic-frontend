import api from '../lib/axios';

export interface Team {
  id: string;
  team_name: string;
  invite_code: string;
  members: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  }[];
}

export const teamService = {
  createTeam: async (team_name: string): Promise<{ message: string; team: Team }> => {
    const response = await api.post('/team/create', { team_name });
    return response.data;
  },

  joinTeam: async (invite_code: string): Promise<{ message: string }> => {
    const response = await api.post('/team/join', { invite_code });
    return response.data;
  },

  deleteTeam: async (teamId: string) => {
    const response = await api.delete(`/team/${teamId}`);
    return response.data;
  },

  removeMember: async (teamId: string, userId: string) => {
    const response = await api.delete(`/team/${teamId}/members/${userId}`);
    return response.data;
  }
};
