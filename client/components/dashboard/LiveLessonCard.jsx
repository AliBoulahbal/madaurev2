// client/components/dashboard/LiveLessonCard.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge'; // Nous allons créer Badge

const LiveLessonCard = ({ lesson }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <Badge color="red">مباشر الآن</Badge>;
      case 'scheduled':
        return <Badge color="blue">مقرر</Badge>;
      case 'completed':
        return <Badge color="green">مكتمل</Badge>;
      default:
        return <Badge color="gray">غير معروف</Badge>;
    }
  };

  return (
    <Card className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
        {getStatusBadge(lesson.status)}
      </div>
      
      <p className="text-gray-600">
        <span className="font-medium text-madaure-primary">الأستاذ:</span> {lesson.teacher}
      </p>
      <p className="text-gray-600">
        <span className="font-medium text-madaure-primary">الوقت:</span> {lesson.time}
      </p>
      
      {/* Bouton d'action */}
      <div className="pt-2">
        {lesson.status === 'live' ? (
          <Button className="w-full" variant="primary">
            إنضم الآن
          </Button>
        ) : lesson.status === 'scheduled' ? (
          <Button className="w-full" variant="outline">
            عرض التفاصيل
          </Button>
        ) : (
          <Button className="w-full" variant="secondary">
            مشاهدة الإعادة
          </Button>
        )}
      </div>
    </Card>
  );
};

export default LiveLessonCard;