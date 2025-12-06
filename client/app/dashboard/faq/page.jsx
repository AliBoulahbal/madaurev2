// client/app/dashboard/faq/page.jsx
'use client';
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { FiHelpCircle, FiChevronDown } from 'react-icons/fi';

const faqData = [
    {
        question: 'كيف يمكنني تفعيل رمز الإشتراك؟',
        answer: 'يمكنك تفعيل الرمز بالذهاب إلى صفحة "الإشتراك" وإدخال الرمز المكون من 8 أرقام الذي تلقيته بعد الشراء. تأكد من أن الرمز غير منتهي الصلاحية.'
    },
    {
        question: 'ما هي مدة صلاحية الدروس المباشرة؟',
        answer: 'بمجرد بث الدرس المباشر، يتم تسجيله ويصبح متاحاً للمشاهدة في مكتبة الدروس لمدة 30 يوماً بعد تاريخ البث.'
    },
    {
        question: 'هل يمكنني تحميل ملفات PDF والملخصات؟',
        answer: 'نعم، إذا كان لديك إشتراك فعال، يمكنك تحميل جميع الملخصات المتوفرة في مكتبة الملخصات بصيغة PDF.'
    },
    {
        question: 'ماذا أفعل إذا واجهت مشكلة تقنية؟',
        answer: 'يرجى التوجه إلى صفحة "الدعم" وإرسال تذكرة شرح للمشكلة. سنقوم بالرد عليك في أقرب وقت ممكن لحل المشكلة.'
    },
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Card className="p-4 shadow-sm border border-gray-200">
            <button 
                className="w-full flex justify-between items-center text-right"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiHelpCircle className="text-madaure-primary" /> {question}
                </span>
                <FiChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isOpen && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-gray-600 text-sm">
                    {answer}
                </p>
            )}
        </Card>
    );
};

const FAQPage = () => {
    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <FiHelpCircle /> الأسئلة الشائعة (FAQ)
            </h2>

            <p className="text-gray-600">ابحث عن إجابات لأسئلتك الأكثر شيوعاً حول المنصة والإشتراكات.</p>

            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
};

export default FAQPage;