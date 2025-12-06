// client/app/dashboard/support/page.jsx
'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { FiLifeBuoy, FiSend, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const SupportPage = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        
        try {
            // NOTE: Ceci est une simulation. En production, cela utiliserait une route POST /api/support/ticket.
            
            // Simulation de l'appel API
            // const response = await api.post('/support/ticket', { subject, details, userId: user._id });
            
            setTimeout(() => {
                const ticketNumber = Math.floor(Math.random() * 90000) + 10000;
                setMessage({ type: 'success', text: `تم إرسال تذكرتك بنجاح! رقم التذكرة هو: #${ticketNumber}. سيتم الرد عليك في غضون 24 ساعة.` });
                setSubject('');
                setDetails('');
                setLoading(false);
            }, 1500);

        } catch (err) {
            setError("فشل في إرسال طلب الدعم. يرجى المحاولة مرة أخرى.");
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <FiLifeBuoy /> إرسال طلب دعم فني
            </h2>

            <p className="text-gray-600">إذا واجهتك مشكلة تقنية أو استفسار حول إشتراكك، يرجى ملء النموذج أدناه.</p>

            {message && <Alert type={message.type} message={message.text} />}
            {error && <Alert type="error" message={error} />}

            <Card className="p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        label="عنوان المشكلة"
                        placeholder="مثال: لا يمكنني تحميل ملخص الفيزياء"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل المشكلة</label>
                        <textarea
                            placeholder="وصف مفصل للمشكلة..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows="6"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-madaure-primary focus:border-madaure-primary transition-colors resize-y"
                            required
                        />
                    </div>

                    <p className="text-xs text-gray-500">
                        سيتم إرسال هذا الطلب باسمك ({user?.email || 'N/A'}).
                    </p>

                    <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                        {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
                        {loading ? 'جاري الإرسال...' : 'إرسال طلب الدعم'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default SupportPage;