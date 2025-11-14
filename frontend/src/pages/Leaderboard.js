import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { calculateLevel, getGroupStyle } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [groups, setGroups] = useState({});
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = () => {
    setLoading(true);
    Promise.all([
      leaderboardAPI.getLeaderboard(),
      leaderboardAPI.getGroups(),
      leaderboardAPI.getUserRank(),
    ])
      .then(([leaderboardRes, groupsRes, rankRes]) => {
        setLeaderboard(leaderboardRes.data.leaderboard || []);
        setGroups(groupsRes.data.groups || {});
        setUserRank(rankRes.data.rank || null);
      })
      .catch((error) => {
        console.error('Failed to fetch leaderboard:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>🏆</span>
              <span>Leaderboard</span>
            </h1>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRank && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-2xl p-6 mb-8 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-1">Your Rank</h3>
                <p className="text-white/90">
                  You're doing great! Keep tracking those habits!
                </p>
              </div>
              <div className="text-5xl font-bold text-white">
                {getRankEmoji(userRank.rank)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-white/80 text-sm">XP</p>
                <p className="text-white text-2xl font-bold">
                  {userRank.xp || 0}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-white/80 text-sm">Level</p>
                <p className="text-white text-2xl font-bold">
                  {calculateLevel(userRank.xp || 0)}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-white/80 text-sm">Habits</p>
                <p className="text-white text-2xl font-bold">
                  {userRank.habitCount || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('overall')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'overall'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Overall Rankings
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'groups'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Groups
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {activeTab === 'overall' && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white">
                    Top Habit Trackers
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {leaderboard.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-gray-600">
                        No one on the leaderboard yet. Be the first!
                      </p>
                    </div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.userId || index}
                        className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                          entry.userId === user?.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl font-bold w-16 text-center">
                            {getRankEmoji(index + 1)}
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            {entry.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {entry.name}
                              {entry.userId === user?.id && (
                                <span className="ml-2 text-sm bg-purple-500 text-white px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Level {calculateLevel(entry.xp || 0)} •{' '}
                              {entry.habitCount || 0} habits
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">
                            {entry.xp || 0}
                          </p>
                          <p className="text-gray-500 text-sm">XP</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(groups).map(([groupName, members]) => {
                  const groupStyle = getGroupStyle(groupName);
                  return (
                    <div
                      key={groupName}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-scale-in"
                    >
                      <div
                        className={`bg-gradient-to-r ${groupStyle.gradient} p-6`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl">{groupStyle.icon}</span>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {groupName}
                            </h3>
                            <p className="text-white/90 text-sm">
                              {members.length} members
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        {members.length === 0 ? (
                          <p className="text-gray-600 text-center py-4">
                            No members yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {members.slice(0, 5).map((member, index) => (
                              <div
                                key={member.userId || index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold">
                                    {member.name?.charAt(0).toUpperCase() || '?'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {member.name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {member.habitCount || 0} habits
                                    </p>
                                  </div>
                                </div>
                                <p className="font-bold text-purple-600">
                                  {member.xp || 0} XP
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;