// client/components/dashboard/QuickActions.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiPlus, FiDownload, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

const actions = [
  { label: 'إنشاء تذكرة دعم', icon: <FiUsers />, href: '/dashboard/support', variant: 'secondary' },
  { label: 'تحميل ملخص جديد', icon: <FiDownload />, href: '/dashboard/summaries', variant: 'secondary' },
  { label: 'إضافة درس مباشر', icon: <FiPlus />, href: '/dashboard/live-lessons', variant: 'primary' },
];

const QuickActions = () => {
  return (
    <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card key={index} className="flex flex-col items-center text-center p-4">
          <div className="text-3xl text-madaure-primary mb-3">{action.icon}</div>
          <p className="font-semibold text-gray-800 mb-4">{action.label}</p>
          <Link href={action.href} className="w-full mt-auto">
            <Button className="w-full" variant={action.variant}>{action.label}</Button>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;