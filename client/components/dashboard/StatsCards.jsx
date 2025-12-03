// client/components/dashboard/StatsCards.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import { FiVideo, FiBookOpen, FiClock, FiUsers } from 'react-icons/fi';

const statsData = [
  { id: 1, label: 'الدروس المكتملة', value: 18, icon: <FiVideo />, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 2, label: 'الملخصات المحملة', value: 45, icon: <FiBookOpen />, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, label: 'ساعات الدراسة', value: '78.5', icon: <FiClock />, color: 'text-madaure-primary', bg: 'bg-red-50' },
  { id: 4, label: 'التفاعل مع الأساتذة', value: 12, icon: <FiUsers />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const StatsCards = () => {
  return (
    <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map(stat => (
        <Card key={stat.id} className="p-5 flex items-center gap-4">
          <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;