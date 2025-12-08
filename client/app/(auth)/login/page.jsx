// client/app/(auth)/login/page.jsx
"use client";
import { useState } from 'react';

// =======================================================================
// IMPORTATIONS DE PRODUCTION
// Ces imports doivent être résolus par votre configuration Next.js/Webpack.
// =======================================================================
import { useAuth } from '@/contexts/AuthContext'; 
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
// =======================================================================


const LoginPage = () => {
  // Destructuration du hook useAuth
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification essentielle : login doit être défini (grâce à AuthProvider dans Root Layout)
    if (!login) {
        setError("Erreur critique: Service d'authentification manquant. Vérifiez votre Root Layout.");
        return;
    }

    setLoading(true);
    try {
        await login(formData.email, formData.password);
        // Redirection gérée par le contexte (vers /dashboard)
    } catch (err) {
        setError(err.message || "فشل في الإتصال. يرجى التحقق من الخادم.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-red-600 tracking-wider">مادور</h1>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">تسجيل الدخول</h2>
                <p className="text-gray-500">مرحباً بعودتك! يرجى إدخال بياناتك.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              {error && (
                <div className="text-red-600 text-center border border-red-200 bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري الإتصال..." : "تسجيل الدخول"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                    هل نسيت كلمة المرور؟ {' '}
                    <Link href="/forgot-password">إستعادة كلمة المرور</Link>
                </p>
                <p className="mt-2 text-gray-600">
                    ليس لديك حساب؟ {' '}
                    <Link href="/register">أنشئ حساباً جديداً</Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;