'use client'; 

import React, { useState, useEffect } from 'react';
// =======================================================================
// Remplacement des importations non résolues par des MOCKS auto-contenus
// =======================================================================
// Importations réelles (Commentées pour résoudre l'erreur de compilation):
// import { useAuth } from '@/contexts/AuthContext'; 
// import { api } from '@/lib/api'; 
// =======================================================================

import { User, Mail, BookOpen, Globe, Calendar, CheckCircle, XCircle, RefreshCw, Loader, AlertTriangle, Key } from 'lucide-react';

// ===========================================
// MOCK DE CONTEXTE ET API
// ===========================================
let currentMockUser = { 
    _id: 'user-123',
    name: 'أحمد علي',
    email: 'ahmad.ali@example.com',
    branch: 'شعبة علوم تجريبية', 
    role: 'student',
};

const mockUpdateUser = (newUserData) => {
    // Simule la mise à jour de l'état global pour que le `useEffect` puisse le détecter
    currentMockUser = { ...currentMockUser, ...newUserData };
    console.log('User update simulated:', currentMockUser);
};

const useAuth = () => ({
    user: currentMockUser, 
    isAuthenticated: true,
    updateUser: mockUpdateUser,
});

// Fonction utilitaire pour simuler l'appel API (PUT /api/users/me)
const api = {
    put: (url, data) => new Promise(resolve => {
        setTimeout(() => {
            if (data.name.toLowerCase().includes('خطأ')) {
                 resolve({ data: { message: 'فشل التحديث. الاسم غير صالح.', _id: null }, status: 400 });
            } else {
                const updatedUser = {
                    ...currentMockUser, 
                    name: data.name, 
                    branch: data.branch
                };
                resolve({ data: updatedUser, status: 200 }); // Retourne les données utilisateur mises à jour
            }
        }, 1000);
    }),
    post: (url, data) => new Promise(resolve => {
        setTimeout(() => {
            if (data.soldToken === 'SUCCESS123') {
                resolve({ data: { status: 'SUCCESS', message: 'تم تفعيل إشتراكك بنجاح!', subscription: { endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'active' } }, status: 200 });
            } else {
                resolve({ data: { status: 'INVALID_TOKEN', message: 'رمز التفعيل غير صالح.' }, status: 400 });
            }
        }, 1500);
    })
};
// ===========================================
// FIN MOCK
// ===========================================


// ===========================================
// Composants UI Simulés (À REMPLACER)
// ===========================================
const Card = ({ children, className = '' }) => <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>{children}</div>;
const Input = ({ label, name, type = 'text', value, onChange, placeholder, disabled = false, required = false }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500 text-right"
            dir="rtl"
        />
    </div>
);
const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-150 disabled:bg-red-300 ${className}`}
    >
        {children}
    </button>
);
const Alert = ({ message, type }) => {
    const color = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                  type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                  'bg-yellow-100 border-yellow-400 text-yellow-700';
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertTriangle;
    return (
        <div className={`border p-4 rounded-lg flex items-start gap-3 ${color} my-4`} dir="rtl">
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm flex-1">{message}</p>
        </div>
    );
};
// ===========================================
// FIN des Composants UI Simulés
// ===========================================


// Données simulées pour l'abonnement
const mockSubscription = {
    planName: 'الباقة الذهبية (سنة)',
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    status: 'active',
};

// Composant principal de la page d'abonnement
const SubscriptionPage = () => {
    // Utilisation des hooks réels
    const { user, updateUser, isAuthenticated } = useAuth(); 
    
    // Initialisation basée sur l'utilisateur réel du contexte (via le mock global)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        branch: user?.branch || '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [subscription, setSubscription] = useState(mockSubscription); // Utilisation d'un mock en attendant l'API
    const [token, setToken] = useState(''); 
    
    // Synchronisation de formData avec l'utilisateur du contexte
    // CRUCIAL : Se déclenche lorsque le contexte utilisateur est mis à jour (après la connexion ou après handleAccountUpdate)
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                name: user.name || '',
                branch: user.branch || 'شعبة غير محددة',
            });
        }
    }, [isAuthenticated, user]); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(null); 
    };
    
    // Logique de mise à jour du compte (Administration du compte)
    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // L'API met à jour les informations et renvoie l'utilisateur mis à jour (PUT /api/users/me)
            const response = await api.put('/api/users/me', formData); 
            
            if (response.data && response.status === 200) {
                setMessage({ type: 'success', text: 'تم تحديث بيانات الحساب بنجاح!' });
                
                // MISE À JOUR CRUCIALE DU CONTEXTE (Répercute dans Header/Sidebar)
                updateUser(response.data); // Met à jour l'état global, déclenchant le useEffect ci-dessus
                
            } else {
                 setMessage({ type: 'error', text: response.data.message || 'فشل التحديث. (بيانات الاستجابة غير صالحة).' });
            }

        } catch (error) {
            // Dans le mock, le statut 400 ou l'absence de données est gérée par le `if`
            const msg = error.data?.message || 'حدث خطأ غير متوقع أثناء التحديث.';
            setMessage({ type: 'error', text: `فشل التحديث: ${msg}` });
        }

        setLoading(false);
    };
    
    // Logique de validation du Token
    const handleTokenActivation = async () => {
        if (!token) {
            setMessage({ type: 'error', text: 'الرجاء إدخال رمز التفعيل.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        
        try {
            // Utilisation de la route API simulée pour la validation de token (POST /api/subscriptions/validateToken)
            const response = await api.post('/api/subscriptions/validateToken', { soldToken: token });

            if (response.data.status === 'SUCCESS') {
                setMessage({ type: 'success', text: response.data.message });
                // Mettre à jour le statut local de l'abonnement
                setSubscription({
                    ...subscription,
                    endDate: response.data.subscription.endDate,
                    status: 'active'
                });
            } else {
                setMessage({ type: 'error', text: response.data.message || 'فشل التفعيل.' });
            }

        } catch (error) {
            const msg = error.data?.message || 'حدث خطأ أثناء الاتصال بالخادم.';
            setMessage({ type: 'error', text: `خطأ في التفعيل: ${msg}` });
        }
        
        setLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-DZ', options);
    };

    const isSubscriptionActive = subscription?.status === 'active';

    // Rendu du composant
    if (!isAuthenticated) {
        return (
             <div className="text-center p-10 text-gray-600" dir="rtl">
                <Loader className="animate-spin inline-block mr-2" /> 
                جاري التحميل...
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">إدارة الحساب والاشتراك</h1>

            {/* Grille de deux colonnes pour le statut et la gestion du compte */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE 1: Statut d'Abonnement et Activation (2/3 de la largeur) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3 mb-4">
                            <Calendar className="h-6 w-6 text-red-600" />
                            حالة الإشتراك
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">الخطة الحالية:</p>
                                <p className="font-extrabold text-lg text-gray-800">{subscription.planName}</p>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">تاريخ الإنتهاء:</p>
                                <p className="font-extrabold text-lg text-red-600">{formatDate(subscription.endDate)}</p>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 font-medium">الحالة:</p>
                                <span className={`text-white font-bold px-3 py-1 rounded-full ${isSubscriptionActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {isSubscriptionActive ? 'نشط' : 'منتهي'}
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
                        <p className="text-gray-600 mb-4">أدخل رمز التفعيل الذي تلقيته لتجديد أو تفعيل إشتراكك. (استخدم `SUCCESS123` للتجربة)</p>
                        <div className="flex gap-3">
                            <Input 
                                name="activationToken" 
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="أدخل رمز الـ Token هنا (مثال: XXXXXXXX)" 
                                className="flex-1"
                                required
                            />
                            <Button onClick={handleTokenActivation} disabled={loading} className="w-40 flex-shrink-0">
                                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'تفعيل'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* COLONNE 2: إدارة الحساب (Account Management) (1/3 de la largeur) */}
                <Card className="lg:col-span-1 h-fit sticky top-20">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 border-b pb-3 mb-4">
                        <User className="h-6 w-6 text-red-600" />
                        إدارة الحساب
                    </h2>
                    
                    {message && <Alert message={message.text} type={message.type} />}

                    <form onSubmit={handleAccountUpdate} className="space-y-4">
                        <Input
                            label="الإسم الكامل"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                         <Input
                            label="البريد الإلكتروني"
                            name="email"
                            type="email"
                            value={user?.email}
                            disabled 
                            placeholder="لا يمكن تعديل البريد الإلكتروني"
                        />
                        <Input
                            label="الشعبة/الفرع الدراسي"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                        />
                        
                        <Button type="submit" disabled={loading} className="mt-6">
                            {loading ? <Loader className="animate-spin h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                            {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionPage;