// src/utils/helpers.js
import { toast } from 'react-toastify';
export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

export const calculateXPProgress = (xp) => {
  return xp % 100;
};

export const getWeirdnessColor = (score) => {
  if (score < 30) return 'text-weirdness-low';
  if (score < 60) return 'text-weirdness-medium';
  if (score < 80) return 'text-weirdness-high';
  return 'text-weirdness-extreme';
};

export const getWeirdnessBadge = (score) => {
  if (score < 30) return '😊 Normal';
  if (score < 60) return '🤔 Quirky';
  if (score < 80) return '🤪 Weird';
  return '🔥 Extremely Weird';
};

export const getGroupStyle = (group) => {
  const styles = {
    'Early Bird': {
      icon: '🌅',
      color: 'bg-yellow-500',
      gradient: 'from-yellow-400 to-orange-500',
    },
    'Night Owl': {
      icon: '🦉',
      color: 'bg-indigo-600',
      gradient: 'from-indigo-500 to-purple-600',
    },
    'Speedster': {
      icon: '⚡',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-teal-500',
    },
    'Binge Master': {
      icon: '🎯',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-pink-500',
    },
  };
  return styles[group] || styles['Speedster'];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateStreak = (habits) => {
  return habits.filter((h) => h.completed).length;
};

export const getAvatarURL = (level) => {
  if (level <= 3) return '/avatars/lvl1.png';
  if (level <= 6) return '/avatars/lvl2.png';
  if (level <= 10) return '/avatars/lvl3.png';
  return '/avatars/lvl-max.png';
};

export const getAccessories = (achievements) => {
  const accessories = [];
  if (achievements?.includes('100_habits')) accessories.push('/avatars/accessory-hat.png');
  if (achievements?.includes('week_streak')) accessories.push('/avatars/accessory-badge.png');
  return accessories;
};

export const showToast = (message, type = 'success') => {
  toast(message, {
    type,
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};