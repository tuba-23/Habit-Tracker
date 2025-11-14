import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'white' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-16 h-16',
  };

  const colors = {
    white: 'border-white',
    primary: 'border-primary-500',
    accent: 'border-accent-500',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;