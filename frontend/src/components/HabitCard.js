import { useState } from 'react';
import { habitAPI } from '../services/api';
import { showToast } from '../utils/helpers';

export function HabitCard({ habit, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      await habitAPI.toggleHabitCompletion(habit.id || habit._id);
      showToast('Habit status updated!', 'success');
    } catch (error) {
      console.error('Failed to toggle habit:', error);
      showToast('Failed to toggle habit', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{habit.description}</h3>
      <p>Category: {habit.category || 'None'}</p>
      <p>Streak: {habit.streak || 0}</p>
      <p>Weirdness Score: {habit.weirdnessScore || 'N/A'}</p>
      <p>Group: {habit.group || 'N/A'}</p>
      <p>AI Comment: {habit.aiComment || 'N/A'}</p>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : habit.completed ? 'Mark Incomplete' : 'Mark Complete'}
      </button>
      <button
        onClick={() => onDelete(habit.id || habit._id)}
        className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}