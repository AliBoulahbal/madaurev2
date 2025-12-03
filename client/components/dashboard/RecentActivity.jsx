// client/components/dashboard/RecentActivity.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import { FiCheckCircle, FiUpload, FiMessageCircle } from 'react-icons/fi';

const activities = [
  { id: 1, text: 'أكملت درس "التكامل المحدد" في الرياضيات.', icon: <FiCheckCircle />, date: 'منذ 5 دقائق', color: 'text-green-500' },
  { id: 2, text: 'قمت بتحميل ملخص "الحركة الدائرية".', icon: <FiUpload />, date: 'منذ ساعتين', color: 'text-blue-500' },
  { id: 3, text: 'رسالة جديدة من الأستاذ أحمد علي.', icon: <FiMessageCircle />, date: 'أمس', color: 'text-madaure-primary' },
];

const RecentActivity = () => {
  return (
    <Card dir="rtl" className="h-full">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">النشاطات الأخيرة</h3>
      <ul className="space-y-4">
        {activities.map(activity => (
          <li key={activity.id} className="flex items-start gap-3">
            <span className={`text-lg pt-1 ${activity.color}`}>{activity.icon}</span>
            <div className="flex-1">
              <p className="text-gray-700 text-base">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecentActivity;