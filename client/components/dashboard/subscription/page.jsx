// client/app/dashboard/subscription/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { FiCheckCircle } from 'react-icons/fi';

const planOptions = [
    { name: 'الباقة البرونزية', price: 49, duration: 'شهر', planKey: 'Bronze', features: ['الوصول إلى الملخصات', '5 حصص مباشرة/شهر'] },
    { name: 'الباقة الذهبية', price: 99, duration: 'شهر', planKey: 'Gold', features: ['وصول غير محدود للمحتوى', 'دروس مباشرة غير محدودة', 'دعم الأستاذ'] },
    { name: 'الباقة السنوية', price: 999, duration: 'سنة', planKey: 'Annual', features: ['توفير 20% سنوياً', 'جميع ميزات الباقة الذهبية'] },
];

const SubscriptionPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/subscriptions/mine'); // Endpoint: /api/subscriptions/mine
      setSubscription(response.data);
    } catch (err) {
      // 404 est attendu si l'utilisateur n'a pas d'abonnement actif
      if (err.response && err.response.status === 404) {
           setSubscription(null);
      } else {
           setError("فشل في تحميل حالة الإشتراك. يرجى المحاولة لاحقاً.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);
  
  const handleCheckout = async (plan) => {
    setMessage(null);
    
    // Calculer la date de fin simulée
    const newEndDate = new Date();
    if (plan.duration === 'شهر') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (plan.duration === 'سنة') {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    try {
        // Envoi de la requête de simulation d'achat (checkout)
        const response = await api.post('/subscriptions/checkout', {
            planName: plan.planKey,
            endDate: newEndDate,
        });
        
        // Mise à jour locale après succès
        setSubscription(response.data.subscription);
        setMessage({ type: 'success', text: response.data.message });
        
    } catch (err) {
        setError(err.response?.data?.message || "فشل في معالجة الإشتراك.");
        console.error("Checkout Error:", err);
    }
  };

  if (loading) return <p dir="rtl" className="text-center text-xl text-madaure-primary p-10">جاري تحميل حالة الإشتراك...</p>;

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">إدارة الإشتراك</h2>
      
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
                {new Date(subscription.endDate).toLocaleDateString('ar-EG')}
              </span>
            </p>
            <div className="mt-4 flex gap-4">
              <Button variant="primary">تجديد الإشتراك</Button>
              <Button variant="outline">إدارة الدفع</Button>
            </div>
          </>
        ) : (
          <Alert type="info" message="لا يوجد لديك إشتراك فعال حالياً. يرجى اختيار باقة." />
        )}
      </Card>

      {/* خيارات الباقة */}
      <h3 className="text-xl font-bold text-gray-800 pt-4">إختر باقتك الجديدة</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planOptions.map((plan, index) => {
            const isCurrent = subscription?.planName === plan.planKey && subscription?.status === 'active';
            
            return (
            <Card key={index} className="flex flex-col">
                <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                <p className="text-4xl font-extrabold text-madaure-primary mb-4">
                {plan.price} <span className="text-xl font-medium">د.م/{plan.duration}</span>
                </p>
                <ul className="space-y-2 text-gray-700 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 text-sm" />
                    {feature}
                    </li>
                ))}
                </ul>
                <Button 
                    className="w-full mt-auto" 
                    variant={isCurrent ? 'secondary' : 'primary'}
                    disabled={isCurrent}
                    onClick={() => handleCheckout(plan)}
                >
                    {isCurrent ? 'الإشتراك فعال حالياً' : 'إختر هذه الباقة'}
                </Button>
            </Card>
        )})}
      </div>
    </div>
  );
};

export default SubscriptionPage;