// client/app/dashboard/summaries/page.jsx
import React from 'react';
import SummaryCard from '@/components/dashboard/SummaryCard';

const mockSummaries = [
  { id: 1, title: 'ملخص الحركة في بعدين', subject: 'الفيزياء', teacher: 'أ. أحمد علي', date: '2024/11/01', downloads: 120 },
  { id: 2, title: 'الأفعال والمسؤوليات القانونية', subject: 'الفلسفة', teacher: 'أ. يوسف خالد', date: '2024/10/25', downloads: 85 },
  { id: 3, title: 'الجداء السلمي والمتجهات', subject: 'الرياضيات', teacher: 'أ. محمد سعيد', date: '2024/10/20', downloads: 210 },
];

const SummariesPage = () => {
  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ملخصات الثالثة الثانوي</h2>
      <p className="text-gray-600">تصفح وحمل ملخصات جميع المواد الدراسية.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSummaries.map(summary => (
          <SummaryCard key={summary.id} summary={summary} />
        ))}
      </div>
    </div>
  );
};

export default SummariesPage;