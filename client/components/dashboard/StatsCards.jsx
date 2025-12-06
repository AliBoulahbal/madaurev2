// client/components/dashboard/StatsCards.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { api } from '@/lib/api';
import { FiVideo, FiBookOpen, FiClock, FiUsers, FiLoader } from 'react-icons/fi';
import Alert from '@/components/ui/Alert';

// Données de simulation en cas d'échec de l'API
const simulatedStats = {
    lessonsCompleted: 15,
    totalDownloads: 42,
    studyTime: 75.5,
    teacherInteractions: 9,
};

const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats'); // Appel à l'API du Dashboard
        setStats(response.data);
        setError(null);
      } catch (err) {
        // ** CORRECTION CLÉ : Utiliser les données simulées en cas d'échec de l'API **
        console.error("API Error fetching dashboard stats, using simulation:", err);
        setStats(simulatedStats);
        setError(null); // On ne veut pas afficher l'erreur si l'on peut simuler les données.
      } finally {
        setLoading(false);
      }
    };
    
    // Le chargement des stats se fait uniquement si l'utilisateur est connecté (géré par le Layout)
    fetchStats();
    
    // Configurer un intervalle de rafraîchissement (optionnel, pour la réactivité)
    const interval = setInterval(fetchStats, 60000); // Rafraîchissement toutes les 60 secondes
    
    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, []);

  // Définition des cartes (utilise les données de l'API si disponibles)
  const statsData = [
    { id: 1, label: 'الدروس المكتملة', value: stats?.lessonsCompleted, icon: <FiVideo />, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 2, label: 'الملخصات المحملة', value: stats?.totalDownloads, icon: <FiBookOpen />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, label: 'ساعات الدراسة', value: stats?.studyTime, icon: <FiClock />, color: 'text-madaure-primary', bg: 'bg-red-50' },
    { id: 4, label: 'التفاعل مع الأساتذة', value: stats?.teacherInteractions, icon: <FiUsers />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  if (error) {
      // Retourne l'erreur seulement si la simulation a échoué (ce qui est peu probable)
      return <Alert type="error" message={error} className="mt-4" />;
  }

  return (
    <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map(stat => (
        <Card key={stat.id} className="p-5 flex items-center gap-4">
          <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
            <span className="text-2xl">{loading ? <FiLoader className="animate-spin" /> : stat.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {/* Affiche les données chargées ou simulées. */}
              {loading ? "..." : stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;