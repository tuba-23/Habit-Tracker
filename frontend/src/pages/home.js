// src/pages/home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-float">
            🎯 Habit Tracker
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-semibold">
            Track your weirdest habits with AI
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            From watching 12 K-Drama episodes in a day to collecting rubber ducks,
            we track them all! Get AI-powered insights, earn XP, level up, and
            compete with other weird habit trackers.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 animate-bounce-slow">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">
              AI Feedback
            </h3>
            <p className="text-white/80 text-sm">
              Get personalized AI comments on your habits with weirdness scores
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 animate-float">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Level Up
            </h3>
            <p className="text-white/80 text-sm">
              Earn XP for every habit, unlock achievements, and level up your avatar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-5xl mb-4 animate-pulse">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Compete
            </h3>
            <p className="text-white/80 text-sm">
              Join groups, climb the leaderboard, and compete with other habit trackers
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            to="/signup"
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 w-full sm:w-auto"
          >
            🚀 Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 w-full sm:w-auto"
          >
            🔑 Login
          </Link>
        </div>

        {/* Groups Preview */}
        <div className="mt-16 space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Join Your Tribe
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Early Bird', icon: '🌅', color: 'from-yellow-400 to-orange-500' },
              { name: 'Night Owl', icon: '🦉', color: 'from-indigo-500 to-purple-600' },
              { name: 'Speedster', icon: '⚡', color: 'from-green-400 to-teal-500' },
              { name: 'Binge Master', icon: '🎯', color: 'from-red-400 to-pink-500' },
            ].map((group) => (
              <div
                key={group.name}
                className={`bg-gradient-to-r ${group.color} px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2 shadow-lg hover:scale-110 transition-all duration-300`}
              >
                <span className="text-2xl">{group.icon}</span>
                <span>{group.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;