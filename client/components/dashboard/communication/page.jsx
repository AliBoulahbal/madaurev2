// client/app/dashboard/communication/page.jsx
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiSend } from 'react-icons/fi';

const CommunicationPage = () => {
  // Données fictives d'un chat ou d'un forum
  const messages = [
    { id: 1, user: 'أ. أحمد علي', text: 'لقد قمت بتحميل الملخصات الجديدة لمادة الفيزياء، يمكنكم الاطلاع عليها.', time: '10:30', role: 'teacher' },
    { id: 2, user: 'أنت', text: 'شكراً جزيلاً أستاذ! هل ستكون هناك حصة مراجعة الأسبوع القادم؟', time: '10:35', role: 'student' },
    { id: 3, user: 'أ. أحمد علي', text: 'نعم، تفاصيلها ستكون في قسم الدروس المباشرة.', time: '10:40', role: 'teacher' },
  ];

  return (
    <div dir="rtl" className="space-y-6 h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800">فضاء التواصل (البث المباشر)</h2>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête du Chat/Forum */}
        <div className="border-b pb-3 mb-4">
          <h3 className="font-semibold text-lg text-madaure-primary">محادثة مادة الفيزياء - مجموعة الثالثة ثانوي</h3>
          <p className="text-sm text-gray-500">
            أخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
          </p>
        </div>

        {/* Zone de Messages (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-xs md:max-w-md p-3 rounded-xl ${
                  msg.role === 'student' 
                    ? 'bg-madaure-primary text-white rounded-bl-none' 
                    : 'bg-gray-200 text-gray-800 rounded-br-none'
                }`}
              >
                <p className="text-xs font-bold mb-1">
                  {msg.user}
                </p>
                <p className="text-sm">{msg.text}</p>
                <span className={`block text-xs mt-1 ${msg.role === 'student' ? 'text-gray-200' : 'text-gray-500'}`}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Zone de saisie */}
        <div className="mt-4 border-t pt-4">
          <form className="flex gap-2">
            <Input 
              placeholder="اكتب رسالتك هنا..." 
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              <FiSend className="text-lg" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CommunicationPage;