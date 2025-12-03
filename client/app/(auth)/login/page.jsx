// client/app/(auth)/login/page.jsx
"use client";
import { useState } from 'react';
import useAuth from '@/hooks/useAuth'; // <-- Utilisation du hook
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
        setError(err.message || "Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* ... (Inputs Email, Password) ... */}
      
      {error && <div className="text-red-600 text-center border border-red-200 bg-red-50 p-2 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Connexion en cours..." : "Se connecter"}
      </Button>
      
      {/* ... (Lien vers Register) ... */}
    </form>
  );
};

export default LoginPage;