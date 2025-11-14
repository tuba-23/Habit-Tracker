import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { habitAPI } from '../services/api';
import Avatar from '../components/Avatar';
import HabitCard from '../components/HabitCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingHabit, setAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiResponse, setShowAiResponse] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = () => {
    setLoading(true);
    habitAPI.getHabits()
      .then((response) => {
        setHabits(response.data.habits || []);
      })
      .catch((error) => {
        console.error('Failed to fetch habits:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    setAddingHabit(true);
    habitAPI.addHabit({ description: newHabit })
      .then((response) => {
        setHabits([response.data.habit, ...habits]);
        setAiResponse(response.data.habit);
        setShowAiResponse(true);
        
        if (response.data.xpEarned) {
          updateUser({
            xp: (user?.xp || 0) + response.data.xpEarned,
          });
        }
        
        setNewHabit('');
        setTimeout(() => setShowAiResponse(false), 5000);
      })
      .catch((error) => {
        console.error('Failed to add habit:', error);
        alert('Failed to add habit. Please try again.');
      })
      .finally(() => {
        setAddingHabit(false);
      });
  };

  const handleDeleteHabit = (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    habitAPI.deleteHabit(habitId)
      .then(() => {
        setHabits(habits.filter((h) => h.id !== habitId));
      })
      .catch((error) => {
        console.error('Failed to delete habit:', error);
        alert('Failed to delete habit. Please try again.');
      });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-20">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>🎯</span>
              <span>Habit Tracker</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/leaderboard"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <span>🏆</span>
                <span>Leaderboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Avatar user={user} size="large" showXP={true} />
        </div>

        {showAiResponse && aiResponse && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-2xl animate-slide-up border-4 border-white/30">
            <div className="flex items-start space-x-4">
              <div className="text-4xl animate-bounce-slow">🤖</div>
              <div className="flex-1 text-white">
                <h3 className="text-xl font-bold mb-2">AI Analysis Complete! 🎉</h3>
                <p className="text-white/90 mb-3 italic">"{aiResponse.aiComment}"</p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="font-semibold">Weirdness Score:</span> {aiResponse.weirdnessScore}/100
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="font-semibold">Group:</span> {aiResponse.group}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="font-semibold">XP Earned:</span> +{aiResponse.xpEarned || 10}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>➕</span>
            <span>Add New Habit</span>
          </h2>
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div>
              <textarea
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Describe your weird habit... (e.g., 'Watch 12 K-Drama episodes in one day')"
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-800 resize-none"
                disabled={addingHabit}
              />
            </div>
            <button
              type="submit"
              disabled={addingHabit || !newHabit.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {addingHabit ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span>🚀</span>
                  <span>Add Habit & Get AI Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
              <span>📋</span>
              <span>Your Habits</span>
            </h2>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">Total: {habits.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : habits.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No habits yet!</h3>
              <p className="text-gray-600">Add your first weird habit above to get started</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id || habit._id}
                  habit={habit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;