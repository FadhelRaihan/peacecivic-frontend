import api from '../lib/axios';

export interface ChatMessage {
  id: string;
  sender_id: string;
  is_forum: boolean;
  team_id: string | null;
  message_body: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
}

export const chatService = {
  getForumHistory: async (): Promise<{ data: ChatMessage[] }> => {
    const response = await api.get('/chat/forum');
    return response.data;
  },

  getTeamHistory: async (teamId: string): Promise<{ data: ChatMessage[] }> => {
    const response = await api.get(`/chat/team/${teamId}`);
    return response.data;
  }
};
