// client/app/(auth)/register/page.jsx
"use client";
import { useState } from 'react';
import useAuth from '@/hooks/useAuth'; // <-- Utilisation du hook
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
        setError("Les mots de passe ne correspondent pas.");
        return;
    }

    setLoading(true);
    try {
        await register(formData.name, formData.email, formData.password);
        // Redirection gérée par le contexte
    } catch (err) {
        setError(err.message || "Échec de l'inscription.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* ... (Inputs Name, Email, Password, ConfirmPassword) ... */}

      {error && <div className="text-red-600 text-center border border-red-200 bg-red-50 p-2 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </Button>
      
      {/* ... (Lien vers Login) ... */}
    </form>
  );
};

export default RegisterPage;