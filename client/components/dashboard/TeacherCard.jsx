// client/components/dashboard/TeacherCard.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiMail, FiStar } from 'react-icons/fi';

const TeacherCard = ({ teacher }) => {
  return (
    <Card className="flex flex-col items-center text-center space-y-3">
      {/* Avatar/Initiales */}
      <div className="w-16 h-16 bg-madaure-light rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
        {teacher.name.charAt(0)}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
      <p className="text-madaure-primary font-medium">{teacher.subject}</p>
      
      <div className="flex items-center gap-1 text-sm text-yellow-500">
        <FiStar />
        <span>{teacher.rating}</span>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2">{teacher.bio}</p>

      <div className="pt-2 w-full">
        <Button className="w-full" variant="outline">
          <span className="flex items-center justify-center gap-2">
            <FiMail /> إرسال رسالة
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default TeacherCard;