// client/app/(auth)/register/page.jsx
"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // <-- CORRECTION : Importation nommée depuis AuthContext
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const RegisterPage = () => {
  const { register } = useAuth(); // Récupère la fonction register du contexte
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return;
    }

    setLoading(true);
    try {
        await register(formData.name, formData.email, formData.password);
        // Redirection gérée par le contexte
    } catch (err) {
        setError(err.message || "فشل في التسجيل. يرجى المحاولة لاحقاً.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} dir="rtl">
      <Input
        type="text"
        name="name"
        placeholder="الاسم الكامل"
        value={formData.name}
        onChange={handleChange}
        required
      />
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
      <Input
        type="password"
        name="confirmPassword"
        placeholder="تأكيد كلمة المرور"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      {error && <div className="text-red-600 text-center border border-red-200 bg-red-50 p-2 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري التسجيل..." : "سجل الآن"}
      </Button>

      <div className="text-center text-sm">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="font-medium text-madaure-primary hover:text-madaure-dark">
          تسجيل الدخول
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;