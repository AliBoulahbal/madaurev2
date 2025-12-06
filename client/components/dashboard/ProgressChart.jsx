// client/components/dashboard/ProgressChart.jsx
'use client';
import React from 'react';
import Card from '@/components/ui/Card';

const ProgressChart = () => {
  return (
    <Card dir="rtl" className="p-6 h-96">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">مخطط التقدم الدراسي</h3>
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>جاري تطوير عرض بياني لتقدمك...</p>
      </div>
    </Card>
  );
};

export default ProgressChart;