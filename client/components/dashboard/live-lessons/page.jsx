// client/app/dashboard/live-lessons/page.jsx
'use client';
import React from 'react';
import LiveLessonCard from '@/components/dashboard/LiveLessonCard';
import Button from '@/components/ui/Button';

// Données fictives pour le développement
const mockLessons = [
  { id: 1, title: 'مراجعة شاملة للفيزياء', teacher: 'أ. أحمد علي', time: 'اليوم، 18:00 مساءً', status: 'live' },
  { id: 2, title: 'أساسيات البرمجة بلغة بايثون', teacher: 'أ. سارة خالد', time: 'غداً، 10:30 صباحاً', status: 'scheduled' },
  { id: 3, title: 'حلول اختبارات الرياضيات', teacher: 'أ. محمد سعيد', time: 'السبت، 14:00 زوالاً', status: 'completed' },
];

const LiveLessonsPage = () => {
  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">الدروس المباشرة</h2>
        <Button variant="primary">
          <span className="flex items-center gap-2">
            + إنشاء درس جديد
          </span>
        </Button>
      </div>
      
      {/* Liste des leçons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLessons.map(lesson => (
          <LiveLessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LiveLessonsPage;