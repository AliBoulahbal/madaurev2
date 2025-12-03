// client/components/dashboard/SummaryCard.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiDownload, FiUser } from 'react-icons/fi';

const SummaryCard = ({ summary }) => {
  return (
    <Card className="flex flex-col space-y-3">
      <h3 className="text-lg font-bold text-madaure-primary">{summary.title}</h3>
      <p className="text-sm text-gray-700">
        <span className="font-medium">المادة:</span> {summary.subject}
      </p>
      <div className="flex items-center text-sm text-gray-500 gap-4">
        <span className="flex items-center gap-1">
          <FiUser className="text-sm" />
          {summary.teacher}
        </span>
        <span className="flex items-center gap-1">
          <FiDownload className="text-sm" />
          {summary.downloads} تحميل
        </span>
      </div>

      <div className="pt-2">
        <Button className="w-full" variant="secondary">
          تحميل الملخص
        </Button>
      </div>
    </Card>
  );
};

export default SummaryCard;