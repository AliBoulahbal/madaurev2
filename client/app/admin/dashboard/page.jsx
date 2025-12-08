// client/app/admin/dashboard/page.jsx - Version redirigée
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

const AdminDashboardRedirect = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.role === 'admin' || user?.role === 'teacher') {
        // Rediriger vers le dashboard avec paramètre
        router.push('/dashboard?view=admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-red-600" />
      </div>
    );
  }

  return null;
};

export default AdminDashboardRedirect;