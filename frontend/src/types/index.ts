export interface User {
  id: number;
  email: string;
  current_streak: number;
  last_completed_date: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  completed_date: string | null;
  owner_id: number;
}

export interface CreateTaskRequest {
  title: string;
}

export interface DashboardData {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  progress_percentage: number;
  current_streak: number;
  last_completed_date: string | null;
  top_users: LeaderboardUser[];
}

export interface LeaderboardUser {
  email: string;
  current_streak: number;
  rank?: number;
}

export interface AIRequest {
  question: string;
}

export interface AIResponse {
  answer: string;
}

export interface PDFSummaryResponse {
  summary: string;
}

export interface Plan {
  id: number;
  title: string;
  description: string;
  owner_id: number;
}

export interface CreatePlanRequest {
  title: string;
  description: string;
}
export interface LeaderboardEntry {
  rank: number;
  user: string;
  streak: number;
}
