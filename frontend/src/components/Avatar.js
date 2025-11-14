
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export function Avatar({ userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <img src={profile?.avatarUrl || '/default-avatar.png'} alt="Avatar" />
      )}
    </div>
  );
}