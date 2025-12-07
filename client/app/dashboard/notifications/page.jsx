'use client';

import React, { useState } from 'react';
// Importations de composants UI (à décommenter/adapter en production)
// import Card from '@/components/ui/Card';
// import { FiVideo, FiAlertCircle, FiCheckCircle, FiBookOpen, FiMessageSquare, FiLoader, FiCheck } from 'react-icons/fi';
// import { useNotifications } from '@/contexts/NotificationContext'; 
// import Link from 'next/link';

// ===========================================
// Mocks locaux pour la compilation (À SUPPRIMER EN PRODUCTION)
// ===========================================
import { Video, AlertTriangle, CheckCircle, BookOpen, MessageSquare, Loader, Check, MessageCircle, Rss } from 'lucide-react';

const Card = ({ children, className = '' }) => <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>{children}</div>;
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;

// Simuler l'utilisation du contexte de notification
const useNotifications = () => {
    const [notifications, setNotifications] = useState([
        { _id: 1, message: 'بدأ درس "المتجهات" الآن. انضم بسرعة!', isRead: false, type: 'lesson', link: '/dashboard/lessons/123', createdAt: new Date(Date.now() - 5 * 60000) },
        { _id: 2, message: 'تم تحديث سياسة الخصوصية. يرجأ المراجعة.', isRead: false, type: 'system', link: '/info/privacy', createdAt: new Date(Date.now() - 24 * 60 * 60000) },
        { _id: 3, message: 'تمت إضافة 3 ملخصات جديدة لمادة التاريخ والجغرافيا.', isRead: true, type: 'subscription', link: '/dashboard/summaries', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000) },
    ]);
    const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.isRead).length);
    const [loading, setLoading] = useState(false);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => {
            if (n._id === id && !n.isRead) {
                setUnreadCount(c => c - 1);
                return { ...n, isRead: true };
            }
            return n;
        }));
        // Envoi de l'API réel: api.put(`/api/notifications/${id}/read`);
    };
    
    return { notifications, unreadCount, loading, markAsRead };
};
// ===========================================

const NotificationIcon = ({ type }) => {
    const defaultClasses = "h-5 w-5";
    switch (type) {
        case 'lesson':
            return <Video className={`${defaultClasses} text-red-600`} />;
        case 'communication':
            return <MessageSquare className={`${defaultClasses} text-blue-600`} />;
        case 'subscription':
            return <BookOpen className={`${defaultClasses} text-green-600`} />;
        case 'system':
        default:
            return <Rss className={`${defaultClasses} text-gray-500`} />;
    }
};

const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} سنة`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} شهر`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} يوم`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} ساعة`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} دقيقة`;
    return "الآن";
};


const NotificationsPage = () => {
    const { notifications, loading, unreadCount, markAsRead } = useNotifications();
    
    // Simuler le tri : non lus d'abord, puis par date
    const sortedNotifications = [...notifications].sort((a, b) => {
        if (!a.isRead && b.isRead) return -1; // a non lu vient avant b lu
        if (a.isRead && !b.isRead) return 1;  // a lu vient après b non lu
        return new Date(b.createdAt) - new Date(a.createdAt); // Le plus récent d'abord
    });
    
    if (loading) {
        return (
            <div className="text-center p-10" dir="rtl">
                <Loader className="animate-spin inline-block h-8 w-8 text-red-600" /> 
                <p className="mt-4 text-gray-600">جاري تحميل الإشعارات...</p>
            </div>
        );
    }
    
    return (
        <div dir="rtl" className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800">
                الإشعارات 
                {unreadCount > 0 && (
                    <span className="mr-2 text-base bg-red-600 text-white px-3 py-1 rounded-full">{unreadCount} غير مقروء</span>
                )}
            </h2>
            <p className="text-gray-600">هذه سجل كامل لجميع إشعارات النظام.</p>

            <Card className="p-0">
                <ul className="divide-y divide-gray-200">
                    {sortedNotifications.length === 0 ? (
                         <li className="py-8 text-center text-gray-500">
                            لا توجد إشعارات حالياً.
                        </li>
                    ) : (
                        sortedNotifications.map(notif => (
                            <li 
                                key={notif._id} 
                                className={`py-4 px-6 flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-red-50 hover:bg-red-100'}`}
                            >
                                <NotificationIcon type={notif.type} />
                                
                                <div className="flex-1">
                                    <Link href={notif.link || '#'} className="block text-gray-800 font-medium hover:text-red-600">
                                        {notif.message}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatTimeAgo(notif.createdAt)}
                                    </p>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    {!notif.isRead ? (
                                        <button 
                                            onClick={() => markAsRead(notif._id)} 
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                            title="ضع علامة مقروءة"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <Check className="h-4 w-4 text-green-500" title="مقروء" />
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </Card>
        </div>
    );
};

export default NotificationsPage;