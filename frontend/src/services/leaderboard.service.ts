import api from "./api";
import type { LeaderboardEntry } from "../types";

class LeaderboardService {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await api.get<LeaderboardEntry[]>("/leaderboard");
    return res.data;
  }
}

export default new LeaderboardService();
