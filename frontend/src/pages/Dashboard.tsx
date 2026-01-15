import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboard.service';
import leaderboardService from '../services/leaderboard.service';
import type { DashboardData, LeaderboardEntry } from '../types';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ProgressBar from '../components/common/ProgressBar';
import Navbar from '../components/layout/Navbar';
import { Target, CheckCircle, Clock, Flame, Trophy, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchTopUsers();
  }, []);

  // ---------------- DASHBOARD DATA ----------------
  const fetchDashboard = async () => {
    try {
      const apiData = await dashboardService.getDashboard();

      // Normalize backend response
      const normalizedData: DashboardData = {
        total_tasks: apiData.progress.total_tasks,
        completed_tasks: apiData.progress.completed_tasks,
        pending_tasks: apiData.progress.pending_tasks,
        progress_percentage: apiData.progress.completion_percentage,
        current_streak: apiData.streak.current_streak,
        last_completed_date: apiData.streak.last_completed_date,
        top_users: [] // handled separately
      };

      setData(normalizedData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- TOP PERFORMERS ----------------
  const fetchTopUsers = async () => {
    try {
      const leaderboard = await leaderboardService.getLeaderboard();
      setTopUsers(leaderboard.slice(0, 5)); // show top 5
    } catch (err) {
      console.error('Failed to load leaderboard');
    }
  };

  if (isLoading || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="max-w-md">
            <p className="text-center text-red-600 text-lg font-medium">{error}</p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your learning progress and achievements
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold">{data.total_tasks}</p>
                </div>
                <Target className="h-8 w-8 text-primary-600" />
              </div>
            </Card>

            <Card>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {data.completed_tasks}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {data.pending_tasks}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </Card>

            <Card>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-red-600">
                    {data.current_streak}
                  </p>
                </div>
                <Flame className="h-8 w-8 text-red-600" />
              </div>
            </Card>
          </div>

          {/* Progress & Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Overall Progress">
              <ProgressBar percentage={data.progress_percentage} height="h-6" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Completed: {data.completed_tasks}</span>
                <span>Total: {data.total_tasks}</span>
              </div>
            </Card>

            <Card title="Streak Information">
              <div className="flex items-center gap-4">
                <Flame className="h-10 w-10 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data.current_streak} days
                  </p>
                  <p className="text-sm text-gray-600">Keep going!</p>
                </div>
              </div>

              {data.last_completed_date && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Last completed:{' '}
                  {new Date(data.last_completed_date).toLocaleDateString()}
                </div>
              )}
            </Card>
          </div>

          {/* Top Performers */}
          <Card title="Top Performers" subtitle="Top learners by streak">
            {topUsers.length > 0 ? (
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={user.user}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0
                        ? 'bg-yellow-50 border-2 border-yellow-300'
                        : index === 1
                        ? 'bg-gray-50 border-2 border-gray-300'
                        : index === 2
                        ? 'bg-orange-50 border-2 border-orange-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary-600 text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{user.user}</p>
                        <p className="text-sm text-gray-600">
                          {user.streak} day streak
                        </p>
                      </div>
                    </div>
                    {index < 3 && <Trophy className="h-6 w-6 text-yellow-500" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No leaderboard data available
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
