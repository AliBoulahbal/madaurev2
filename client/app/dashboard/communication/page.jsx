// client/app/dashboard/communication/page.jsx
'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const CommunicationPage = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([
        { id: 1, sender: 'Teacher', text: 'مرحباً، كيف يمكنني مساعدتك اليوم بخصوص دروس الفيزياء؟', time: 'منذ 5 دقائق' },
        { id: 2, sender: 'You', text: 'لدي سؤال حول حل تمرين الدوال اللوغاريتمية.', time: 'منذ 3 دقائق' }
    ]);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Simulation de l'envoi de message
            // En production, utiliserait POST /api/support/message ou /api/communication
            
            const newMessage = {
                id: Date.now(),
                sender: 'You',
                text: message,
                time: 'الآن'
            };
            
            setHistory(prev => [...prev, newMessage]);
            setMessage('');

            // Simuler une réponse de l'enseignant après 2 secondes
            setTimeout(() => {
                setHistory(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'Teacher',
                    text: 'أتفهم، سأقوم بتحميل ملف الشرح المفصل للتمرين.',
                    time: 'بعد قليل'
                }]);
            }, 2000);

        } catch (err) {
            setError("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <FiMessageSquare /> فضاء التواصل مع الأساتذة
            </h2>

            <Alert type="info" message="هذا الفضاء يسمح لك بالتواصل المباشر مع أساتذتك. سيتم الرد عليك في غضون 24 ساعة." />
            
            <Card className="flex flex-col h-[70vh] shadow-lg">
                {/* Historique des Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                                    msg.sender === 'You' 
                                    ? 'bg-madaure-primary text-white rounded-bl-lg' 
                                    : 'bg-gray-100 text-gray-800 rounded-br-lg'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-semibold text-sm ${msg.sender === 'You' ? 'text-white' : 'text-madaure-primary'}`}>
                                        {msg.sender === 'You' ? user?.name : 'الأستاذ أحمد'}
                                    </span>
                                    <span className="text-xs opacity-70">{msg.time}</span>
                                </div>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Champ de Saisie */}
                <form onSubmit={handleSubmit} className="border-t p-4 flex gap-3 bg-white">
                    <Input
                        type="text"
                        placeholder="اكتب رسالتك هنا..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                        required
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
                        إرسال
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default CommunicationPage;