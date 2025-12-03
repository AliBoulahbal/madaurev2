// client/app/dashboard/faq/page.jsx
'use client';
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const mockFaq = [
  { id: 1, question: 'كيف يمكنني تجديد اشتراكي؟', answer: 'يمكنك تجديد اشتراكك بالذهاب إلى صفحة "إدارة الإشتراك" واختيار خطة جديدة.' },
  { id: 2, question: 'ما هي مواعيد الدروس المباشرة؟', answer: 'يتم نشر مواعيد الدروس الأسبوعية في قسم "الدروس المباشرة" ويتم إرسال إشعار قبل بدء الدرس.' },
  { id: 3, question: 'هل يمكنني التواصل المباشر مع الأساتذة؟', answer: 'نعم، يمكنك التواصل عبر "فضاء التواصل" أو إرسال بريد إلكتروني خاص عبر صفحة الأستاذ.' },
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right flex justify-between items-center font-semibold text-lg text-gray-800 hover:text-madaure-primary transition"
      >
        {faq.question}
        {isOpen ? <FiChevronUp className="text-madaure-primary" /> : <FiChevronDown />}
      </button>
      {isOpen && (
        <div className="mt-3 pr-6 text-gray-600 border-r-2 border-madaure-light py-2">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">الأسئلة الشائعة (FAQ)</h2>
      <p className="text-gray-600">ابحث عن إجابات لاستفساراتك الأكثر شيوعاً.</p>

      <Card>
        <div>
          {mockFaq.map(faq => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FAQPage;