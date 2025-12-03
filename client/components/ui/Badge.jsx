// client/components/ui/Badge.jsx
import React from 'react';

const colorClasses = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-700',
  madaure: 'bg-madaure-primary text-white',
};

const Badge = ({ children, color = 'gray' }) => {
  const classes = colorClasses[color] || colorClasses.gray;
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${classes}`}>
      {children}
    </span>
  );
};

export default Badge;