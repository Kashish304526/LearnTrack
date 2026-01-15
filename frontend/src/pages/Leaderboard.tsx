import React, { useState, useEffect } from 'react';
import leaderboardService from '../services/leaderboard.service';
import type { LeaderboardEntry } from '../types';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Navbar from '../components/layout/Navbar';
import { Trophy, Medal, Award, Flame } from 'lucide-react';

/**
 * Leaderboard page showing user rankings by streak
 */
const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const leaderboardData = await leaderboardService.getLeaderboard();
      setUsers(leaderboardData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-orange-500" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-yellow-900 border-yellow-500';
      case 2:
        return 'bg-gray-400 text-gray-900 border-gray-500';
      case 3:
        return 'bg-orange-400 text-orange-900 border-orange-500';
      default:
        return 'bg-gray-300 text-gray-700 border-gray-400';
    }
  };

  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader size="lg" text="Loading leaderboard..." />
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
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">{error}</p>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 p-4 rounded-full">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
            <p className="text-gray-600 mt-2">See how you rank against other learners</p>
          </div>

          {/* Top 3 Podium */}
          {users.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center pt-8">
                <div className="bg-gray-400 text-gray-900 rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-2">
                  2
                </div>
                <Medal className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-800 text-center truncate w-full px-2">
                  {users[1].user}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-red-500" />
                  {users[1].streak} days
                </p>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="bg-yellow-400 text-yellow-900 rounded-full w-20 h-20 flex items-center justify-center font-bold text-3xl mb-2 shadow-lg">
                  1
                </div>
                <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
                <p className="text-sm font-medium text-gray-800 text-center truncate w-full px-2">
                  {users[0].user}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-red-500" />
                  {users[0].streak} days
                </p>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center pt-12">
                <div className="bg-orange-400 text-orange-900 rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl mb-2">
                  3
                </div>
                <Award className="h-9 w-9 text-orange-500 mb-2" />
                <p className="text-sm font-medium text-gray-800 text-center truncate w-full px-2">
                  {users[2].user}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-red-500" />
                  {users[2].streak} days
                </p>
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <Card title="Top 10 Rankings" subtitle="All users ranked by learning streak">
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => {
                  const rank = user.rank;
                  return (
                    <div
                      key={user.user}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${getCardStyle(
                        rank
                      )}`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-2 ${getRankBadgeColor(
                            rank
                          )}`}
                        >
                          {rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{user.user}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Flame className="h-4 w-4 text-red-500" />
                            {user.streak} day streak
                          </p>
                        </div>
                      </div>
                      {rank <= 3 && <div className="ml-4">{getRankIcon(rank)}</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No users on the leaderboard yet</p>
                <p className="text-sm mt-2">Be the first to start your learning streak!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
