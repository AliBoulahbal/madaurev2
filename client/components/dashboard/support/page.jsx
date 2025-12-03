// client/app/dashboard/support/page.jsx
'use client';
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const mockTickets = [
  { id: 'TKT-001', subject: 'مشكلة في تشغيل الدروس المباشرة', status: 'En Cours', date: '2025/11/28' },
  { id: 'TKT-002', subject: 'خطأ في معلومات ملفي الشخصي', status: 'Résolu', date: '2025/11/25' },
];

const SupportPage = () => {
  const [newTicket, setNewTicket] = useState({ subject: '', details: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`تم إرسال تذكرتك حول: ${newTicket.subject}`);
    setNewTicket({ subject: '', details: '' });
  };

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">مركز الدعم والمساعدة</h2>

      {/* قسم إنشاء تذكرة جديدة */}
      <Card>
        <h3 className="text-xl font-bold text-madaure-primary mb-4 border-b pb-3">فتح تذكرة دعم جديدة</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="عنوان المشكلة"
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            required
          />
          <textarea
            rows="4"
            placeholder="وصف تفصيلي للمشكلة..."
            value={newTicket.details}
            onChange={(e) => setNewTicket({ ...newTicket, details: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madaure-primary focus:border-madaure-primary transition duration-150 ease-in-out"
            required
          ></textarea>
          <Button type="submit">إرسال طلب الدعم</Button>
        </form>
      </Card>

      {/* قسم تذاكر الدعم المفتوحة */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">تذاكر الدعم السابقة</h3>
        <ul className="space-y-3">
          {mockTickets.map(ticket => (
            <li key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{ticket.subject} - ({ticket.id})</p>
                <p className="text-sm text-gray-500 mt-1">تاريخ الإرسال: {ticket.date}</p>
              </div>
              <Badge color={ticket.status === 'Résolu' ? 'green' : 'blue'}>
                {ticket.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default SupportPage;