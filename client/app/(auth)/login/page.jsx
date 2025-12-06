// client/app/(auth)/login/page.jsx
"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // <-- CORRECTION : Importation nommée depuis AuthContext
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const LoginPage = () => {
  const { login } = useAuth(); // Récupère la fonction login du contexte
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
        await login(formData.email, formData.password);
        // Redirection gérée par le contexte
    } catch (err) {
        setError(err.message || "فشل في الإتصال. يرجى التحقق من الخادم.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} dir="rtl">
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
      
      {error && <div className="text-red-600 text-center border border-red-200 bg-red-50 p-2 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري الإتصال..." : "تسجيل الدخول"}
      </Button>

      <div className="text-center text-sm">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="font-medium text-madaure-primary hover:text-madaure-dark">
          سجل الآن
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;