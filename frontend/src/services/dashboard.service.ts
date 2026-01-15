import api from './api';

/**
 * Dashboard service for fetching dashboard statistics
 */
class DashboardService {
  async getDashboard(): Promise<any> {
    const response = await api.get('/dashboard');
    return response.data;
  }
}

export default new DashboardService();
