// client/app/dashboard/notifications/page.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import { FiVideo, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const mockNotifications = [
  { id: 1, type: 'lesson', text: 'بدأ درس "المتجهات" الآن. انضم بسرعة!', date: 'منذ 5 دقائق', icon: <FiVideo />, color: 'text-madaure-primary' },
  { id: 2, type: 'alert', text: 'تم تحديث سياسة الخصوصية. يرجى المراجعة.', date: 'منذ يوم', icon: <FiAlertCircle />, color: 'text-yellow-500' },
  { id: 3, type: 'update', text: 'تمت إضافة 3 ملخصات جديدة لمادة التاريخ والجغرافيا.', date: 'منذ 3 أيام', icon: <FiCheckCircle />, color: 'text-green-500' },
  { id: 4, type: 'lesson', text: 'تذكير: درس الكيمياء العضوية مقرر غداً في الساعة 9:00 صباحاً.', date: 'منذ أسبوع', icon: <FiVideo />, color: 'text-blue-500' },
];

const NotificationsPage = () => {
  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">الإشعارات</h2>
      <p className="text-gray-600">هذه سجل كامل لجميع إشعارات النظام.</p>

      <Card>
        <ul className="divide-y divide-gray-200">
          {mockNotifications.map(notif => (
            <li key={notif.id} className="py-4 flex items-start gap-4 hover:bg-gray-50 transition duration-150 px-2 -mx-2 rounded-lg">
              <div className={`text-2xl ${notif.color} pt-1`}>
                {notif.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{notif.text}</p>
                <p className="text-sm text-gray-500 mt-1">{notif.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default NotificationsPage;