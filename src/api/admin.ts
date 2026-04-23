import api from '../lib/axios';

export const adminService = {
    getUsers: () => api.get('/admin/users'),
    createUser: (data: any) => api.post('/admin/users', data),
    updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    
    // Relation Management
    getBadges: () => api.get('/badges'),
    awardBadge: (data: { userId: string, badgeId: string }) => api.post('/admin/users/award-badge', data),
    revokeBadge: (userBadgeId: string) => api.delete(`/admin/users/revoke-badge/${userBadgeId}`),
    removeFromTeam: (teamMemberId: string) => api.delete(`/admin/users/remove-from-team/${teamMemberId}`),

    // Module Management
    getModules: () => api.get('/admin/modules'),
    createModule: (data: FormData) => api.post('/admin/modules', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateModule: (id: string, data: FormData) => api.put(`/admin/modules/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteModule: (id: string) => api.delete(`/admin/modules/${id}`),

    // Mission Management
    getMissions: () => api.get('/admin/missions'),
    createMission: (data: any) => api.post('/admin/missions', data),
    updateMission: (id: string, data: any) => api.put(`/admin/missions/${id}`, data),
    deleteMission: (id: string) => api.delete(`/admin/missions/${id}`),

    // Reports & Statistics
    getOverviewStats: () => api.get('/admin/reports/overview'),
    getActivityStats: () => api.get('/admin/reports/activity'),
    getBadgeStats: () => api.get('/admin/reports/badges'),
    getLeaderboard: () => api.get('/admin/reports/leaderboard'),
    getClassroomStats: () => api.get('/admin/reports/classrooms'),
    getMissionInsights: () => api.get('/admin/reports/missions'),
    getDetailedStats: (classroom?: string) => api.get(`/admin/reports/detailed`, { params: { classroom } }),
    // getSettings: () => api.get('/admin/settings'),
    // updateSettings: (data: any) => api.patch('/admin/settings', data),
    getHealthStatus: () => api.get('/admin/health'),
};
