// client/components/dashboard/UpcomingLessons.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiCalendar, FiClock } from 'react-icons/fi';

const upcoming = [
  { id: 1, title: 'الاحتمالات والإحصاء', teacher: 'أ. خالد', date: 'الخميس', time: '16:00' },
  { id: 2, title: 'الكيمياء العضوية', teacher: 'أ. فاطمة', date: 'الجمعة', time: '09:00' },
];

const UpcomingLessons = () => {
  return (
    <Card dir="rtl" className="h-full">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">الدروس القادمة</h3>
      <ul className="space-y-4">
        {upcoming.map(lesson => (
          <li key={lesson.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{lesson.title}</p>
              <p className="text-sm text-gray-600 mt-1">{lesson.teacher}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-madaure-primary" /> {lesson.date}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="text-madaure-primary" /> {lesson.time}
              </span>
            </div>
            <Button size="sm" variant="outline" className="mr-4">عرض</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default UpcomingLessons;