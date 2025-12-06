// client/app/dashboard/subscription/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { FiCheckCircle, FiUnlock, FiLoader } from 'react-icons/fi'; // Ajout de FiLoader
import { api } from '@/lib/api'; // Importation de l'instance API

// ID de l'appareil (simulé)
const getDeviceId = () => {
    return typeof window !== 'undefined' ? (localStorage.getItem('deviceId') || 'DEFAULT_DEVICE_ID_123') : 'SERVER_ID';
};

// Fonction utilitaire pour convertir la date au format 3/1/2026 (chiffres occidentaux)
const formatDateWestern = (date) => {
    // Utilise une locale occidentale (en-US) pour garantir les chiffres 0-9
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
};

const SubscriptionPage = () => {
  const { user, isAuthenticated } = useAuth(); // Utiliser isAuthenticated
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState('');
  
  const PRICE_DA = 3500;
  const PLAN_NAME = 'BAC Access (Token)';

  const fetchSubscription = async () => {
    // Si nous atteignons cette fonction, le Layout a déjà confirmé que isAuthenticated est true.
    setLoading(true);
    try {
        // Normalement, cette route récupérerait l'état réel de l'abonnement
        const response = await api.get('/subscriptions/mine');
        setSubscription(response.data);
    } catch (err) {
        // Si 404 est renvoyé (pas d'abonnement actif), c'est normal
        if (err.response && err.response.status === 404) {
            setSubscription(null);
        } else {
            setError("فشل في تحميل حالة الإشتراك.");
            console.error("Subscription Status Error:", err);
        }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // ** CORRECTION CLÉ : Appeler fetchSubscription UNIQUEMENT si l'utilisateur est authentifié **
    // Le Layout garantit que user est non-null ici, mais c'est une sécurité supplémentaire
    if (isAuthenticated) { 
        fetchSubscription();
    }
  }, [isAuthenticated]); // Dépend de l'état d'authentification pour s'assurer que le token est chargé

  // Gère l'activation du token
  const handleTokenActivation = async (e) => {
    e.preventDefault();
    if (token.length !== 8) {
        setError("رمز التفعيل يجب أن يتكون من 8 أرقام.");
        return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
        // Cet appel utilise maintenant l'instance API configurée avec le token JWT
        const response = await api.post('/subscriptions/validateToken', { 
            soldToken: token, 
            deviceId: getDeviceId() 
        });
        
        // Gérer la réponse de succès
        setSubscription({ planName: PLAN_NAME, status: 'active', endDate: response.data.subscription.endDate });
        setMessage({ type: 'success', text: `تم تفعيل الرمز بنجاح! لديك الآن وصول كامل.` });
        
        // Recharger l'état de l'utilisateur ou de l'abonnement si nécessaire
        // fetchSubscription(); 
        
    } catch (err) {
        // Gérer les erreurs 400 du Backend (ex: INVALID SOLD TOKEN)
        if (err.response && err.response.data && err.response.data.message) {
            setError(`فشل التفعيل: ${err.response.data.message}`);
        } else {
             // Erreur réseau ou 500 interne (où le token est bien envoyé mais le contrôleur plante)
            setError("خطأ في الاتصال بالخادم. تأكد من أن الرمز صحيح وحاول مرة أخرى.");
            console.error("Token Activation Error:", err);
        }
    } finally {
        setLoading(false);
    }
  };

  // Affichage du chargement initial ou si l'utilisateur n'est pas authentifié
  if (loading) return (
    <p dir="rtl" className="text-center text-xl text-madaure-primary p-10 flex justify-center items-center gap-2">
        <FiLoader className="animate-spin" /> جاري تحميل حالة الإشتراك...
    </p>
  );

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">إدارة الإشتراك وتفعيل الرمز</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {message && <Alert type={message.type} message={message.text} className="mb-4" />}

      {/* حالة الإشتراك الحالي */}
      <Card>
        <h3 className="text-xl font-bold text-madaure-primary mb-4">إشتراكك الحالي</h3>
        {subscription ? (
          <>
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-green-500 text-2xl" />
                <span className="font-semibold text-gray-900">{subscription.planName}</span>
              </div>
              <Badge color="green">فعال</Badge>
            </div>
            
            <p className="text-gray-700">تاريخ الإنتهاء: 
              <span className="font-medium">
                {/* CORRECTION CLÉ : Utiliser la nouvelle fonction de formatage pour les chiffres occidentaux */}
                {formatDateWestern(subscription.endDate)}
              </span>
            </p>
            <Button variant="outline" className="mt-4">
                إدارة الحساب
            </Button>
          </>
        ) : (
          <Alert type="info" message="لا يوجد لديك إشتراك فعال حالياً. يرجى تفعيل الرمز الخاص بك." />
        )}
      </Card>

      {/* قسم تفعيل الرمز (Activation Token) */}
      <Card className="border-2 border-dashed border-madaure-light">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiUnlock className="text-madaure-primary" /> تفعيل رمز الوصول 
        </h3>
        <p className="text-gray-600 mb-4">
            قم بإدخال رمز التفعيل المكون من 8 أرقام الذي قمت بشرائه ({PRICE_DA} د.ج) للحصول على وصول كامل.
        </p>
        
        <form onSubmit={handleTokenActivation} className="flex gap-4">
            <Input 
                type="text"
                placeholder="أدخل الرمز المكون من 8 أرقام"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={8}
                required
                className="text-center"
            />
            <Button type="submit" variant="primary" disabled={loading || token.length !== 8}>
                {loading ? 'جاري التفعيل...' : 'تفعيل'}
            </Button>
        </form>
      </Card>
    </div>
  );
};

export default SubscriptionPage;