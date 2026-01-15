import api from './api';
import type { Plan, CreatePlanRequest } from '../types';

class PlanService {
  async getPlans(): Promise<Plan[]> {
    const res = await api.get<Plan[]>('/plans');
    return res.data;
  }

  async createPlan(data: CreatePlanRequest): Promise<void> {
    await api.post('/plans', data);
  }

  async updatePlan(planId: number, data: CreatePlanRequest): Promise<void> {
    await api.put(`/plans/${planId}`, data);
  }

  async deletePlan(planId: number): Promise<void> {
    await api.delete(`/plans/${planId}`);
  }
}

export default new PlanService();
