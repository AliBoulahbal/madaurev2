// client/components/ui/Alert.jsx
import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const colorClasses = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700',
};

const iconMap = {
  success: <FiCheckCircle />,
  error: <FiXCircle />,
  info: <FiAlertCircle />,
};

const Alert = ({ type = 'info', message, className = '' }) => {
  const classes = colorClasses[type] || colorClasses.info;
  const Icon = iconMap[type] || iconMap.info;

  return (
    <div dir="rtl" className={`border p-4 rounded-lg flex items-center gap-3 ${classes} ${className}`} role="alert">
      <div className="text-xl">{Icon}</div>
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;