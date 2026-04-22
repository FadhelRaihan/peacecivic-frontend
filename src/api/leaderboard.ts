import api from '../lib/axios';

export interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  points: number;
  class_room: string | null;
}

export const leaderboardService = {
  getLeaderboard: async (): Promise<{ data: LeaderboardUser[] }> => {
    const response = await api.get('/leaderboard');
    return response.data;
  }
};
