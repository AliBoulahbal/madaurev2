// client/app/dashboard/subscription/page.jsx - VERSION PRODUCTION
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; 
import { api } from '@/lib/api'; 
import { User, Mail, Calendar, CheckCircle, XCircle, RefreshCw, Loader, AlertTriangle, Key } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const SubscriptionPage = () => {
    const { user, updateUser, isAuthenticated } = useAuth(); 
    
    // Initialisation basée sur l'utilisateur réel
    const [formData, setFormData] = useState({
        name: '',
        branch: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [token, setToken] = useState(''); 
    
    // Synchronisation de formData avec l'utilisateur du contexte
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                name: user.name || '',
                branch: user.branch || '',
            });
            
            // Charger les données d'abonnement
            fetchSubscription();
        }
    }, [isAuthenticated, user]);

    // Fonction pour charger l'abonnement
    const fetchSubscription = async () => {
        if (!user) return;
        
        setSubscriptionLoading(true);
        try {
            const response = await api.get('/subscriptions/mine');
            setSubscription(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'abonnement:', error);
            // Si pas d'abonnement actif, définir un état par défaut
            setSubscription({
                planName: 'غير مشترك',
                status: 'inactive',
                endDate: null
            });
        } finally {
            setSubscriptionLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(null); 
    };
    
    // Logique de mise à jour du compte
    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // API réelle : PUT /api/users/me
            const response = await api.put('/users/me', formData); 
            
            if (response.status === 200) {
                setMessage({ 
                    type: 'success', 
                    text: 'تم تحديث بيانات الحساب بنجاح!' 
                });
                
                // Mettre à jour le contexte global
                updateUser(response.data);
                
            } else {
                setMessage({ 
                    type: 'error', 
                    text: response.data?.message || 'فشل التحديث. يرجى المحاولة لاحقاً.' 
                });
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'حدث خطأ غير متوقع أثناء التحديث.';
            
            setMessage({ 
                type: 'error', 
                text: `فشل التحديث: ${errorMessage}` 
            });
        }

        setLoading(false);
    };
    
    // Logique de validation du Token
    const handleTokenActivation = async () => {
        if (!token.trim()) {
            setMessage({ 
                type: 'error', 
                text: 'الرجاء إدخال رمز التفعيل.' 
            });
            return;
        }
        
        setLoading(true);
        setMessage(null);
        
        try {
            // API réelle : POST /api/subscriptions/validateToken
            const response = await api.post('/subscriptions/validateToken', { 
                soldToken: token,
                deviceId: 'web-' + Date.now() // ID d'appareil simulé
            });

            if (response.data.status === 'SUCCESS') {
                setMessage({ 
                    type: 'success', 
                    text: response.data.message 
                });
                
                // Mettre à jour l'abonnement local
                setSubscription({
                    ...subscription,
                    endDate: response.data.subscription.endDate,
                    status: 'active'
                });
                
                // Réinitialiser le champ token
                setToken('');
                
                // Rafraîchir les données utilisateur si nécessaire
                if (updateUser) {
                    const userResponse = await api.get('/users/me');
                    updateUser(userResponse.data);
                }
                
            } else {
                setMessage({ 
                    type: 'error', 
                    text: response.data.message || 'فشل التفعيل.' 
                });
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'حدث خطأ أثناء الاتصال بالخادم.';
            
            setMessage({ 
                type: 'error', 
                text: `خطأ في التفعيل: ${errorMessage}` 
            });
        }
        
        setLoading(false);
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('ar-DZ', options);
        } catch (error) {
            return 'تاريخ غير صالح';
        }
    };

    const isSubscriptionActive = subscription?.status === 'active';

    // Affichage du chargement
    if (!isAuthenticated || subscriptionLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]" dir="rtl">
                <Loader className="animate-spin text-4xl text-red-600" />
                <p className="mr-3 text-gray-600">جاري تحميل بيانات الإشتراك...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">
                إدارة الحساب والاشتراك
            </h1>

            {/* Grille de deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE 1: Statut d'Abonnement et Activation */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Carte Statut d'Abonnement */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3 mb-4">
                            <Calendar className="h-6 w-6 text-red-600" />
                            حالة الإشتراك
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">الخطة الحالية:</p>
                                <p className="font-extrabold text-lg text-gray-800">
                                    {subscription?.planName || 'غير مشترك'}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">تاريخ الإنتهاء:</p>
                                <p className={`font-extrabold text-lg ${isSubscriptionActive ? 'text-red-600' : 'text-gray-500'}`}>
                                    {formatDate(subscription?.endDate)}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">الحالة:</p>
                                <span className={`text-white font-bold px-3 py-1 rounded-full ${
                                    isSubscriptionActive ? 'bg-green-500' : 
                                    subscription?.status === 'expired' ? 'bg-red-500' : 
                                    'bg-gray-500'
                                }`}>
                                    {isSubscriptionActive ? 'نشط' : 
                                     subscription?.status === 'expired' ? 'منتهي' : 
                                     'غير نشط'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Section d'Activation de Token */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3 mb-4">
                            <Key className="h-6 w-6 text-red-600" />
                            تفعيل رمز الإشتراك
                        </h2>
                        
                        <p className="text-gray-600 mb-4">
                            أدخل رمز التفعيل الذي تلقيته لتجديد أو تفعيل إشتراكك.
                        </p>
                        
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <Input 
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="أدخل رمز التفعيل هنا (مثال: 20252026)"
                                    className="text-center"
                                    required
                                />
                            </div>
                            <Button 
                                onClick={handleTokenActivation} 
                                disabled={loading || !token.trim()}
                                className="md:w-40"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5" />
                                        جاري التفعيل...
                                    </>
                                ) : 'تفعيل'}
                            </Button>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500">
                            <p>ملاحظة: رمز التفعيل يتكون عادة من 8 أرقام.</p>
                        </div>
                    </Card>
                </div>

                {/* COLONNE 2: إدارة الحساب */}
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3 mb-4">
                            <User className="h-6 w-6 text-red-600" />
                            إدارة الحساب
                        </h2>
                        
                        {message && (
                            <Alert 
                                type={message.type} 
                                message={message.text} 
                                className="mb-4"
                            />
                        )}

                        <form onSubmit={handleAccountUpdate} className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                placeholder="الإسم الكامل"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            
                            <div className="relative">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="البريد الإلكتروني"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <div className="absolute left-3 top-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    لا يمكن تعديل البريد الإلكتروني
                                </p>
                            </div>
                            
                            <Input
                                type="text"
                                name="branch"
                                placeholder="الشعبة/الفرع الدراسي"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                            
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="mt-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5" />
                                        جاري التحديث...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-5 w-5" />
                                        تحديث البيانات
                                    </>
                                )}
                            </Button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                معلومات إضافية
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>الدور: <span className="font-medium">{user?.role === 'admin' ? 'مسؤول' : 
                                                                         user?.role === 'teacher' ? 'أستاذ' : 
                                                                         'طالب'}</span></p>
                                <p>تاريخ التسجيل: {user?.createdAt ? formatDate(user.createdAt) : 'غير معروف'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;