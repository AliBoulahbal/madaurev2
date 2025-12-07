'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// =======================================================================
// Remplacement des importations non résolues par des MOCKS auto-contenus
// NOTE : En production, vous devriez décommenter les lignes ci-dessous et supprimer les MOCKS.
// import { api } from '@/lib/api'; 
// import { useAuth } from '@/contexts/AuthContext'; 
// =======================================================================

// =======================================================================
// MOCKS POUR LA COMPILATION (À SUPPRIMER EN PRODUCTION)
// =======================================================================
// Simuler l'instance API pour la récupération des notifications
const api = {
    get: (url) => new Promise(resolve => {
        setTimeout(() => {
            const mockNotifications = [
                { _id: 1, message: 'بدأ درس "المتجهات" الآن. انضم بسرعة!', isRead: false, type: 'lesson', link: '/dashboard/lessons/123', createdAt: new Date(Date.now() - 5 * 60000) },
                { _id: 2, message: 'تم تحديث سياسة الخصوصية. يرجأ المراجعة.', isRead: false, type: 'system', link: '/info/privacy', createdAt: new Date(Date.now() - 24 * 60 * 60000) },
                { _id: 3, message: 'تمت إضافة 3 ملخصات جديدة لمادة التاريخ والجغرافيا.', isRead: true, type: 'subscription', link: '/dashboard/summaries', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000) },
            ];
            const unreadCount = mockNotifications.filter(n => !n.isRead).length;

            resolve({ data: { notifications: mockNotifications, unreadCount } });
        }, 800);
    }),
    put: (url) => new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 200, data: { message: 'Marked as read' } });
        }, 100);
    })
};

// Simuler l'authentification
const useAuth = () => {
    // Utiliser useState pour simuler le comportement dynamique d'un contexte réel
    const [user] = useState({ _id: 'user-123', name: 'Mock User' }); 
    return {
        user,
        isAuthenticated: true,
        updateUser: () => console.log('Mock updateUser called'), 
    };
};
// =======================================================================


const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const FETCH_INTERVAL_MS = 30000; // Intervalle de 30 secondes pour rafraîchir

export const NotificationProvider = ({ children }) => {
    // Utilisation des hooks et de l'utilisateur réel
    const { user, isAuthenticated } = useAuth(); 
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer les notifications depuis l'API
    const fetchNotifications = useCallback(async () => {
        // Vérifie si l'utilisateur est authentifié et disponible avant de faire l'appel API
        if (!isAuthenticated || !user || !user._id) { 
            setLoading(false);
            return;
        }

        try {
            // APPEL API RÉEL
            const response = await api.get('/api/notifications'); 
            // Votre contrôleur renvoie un tableau de notifications
            const fetchedNotifications = response.data.notifications || response.data;
            
            // Calculer le nombre non lu côté client
            const count = fetchedNotifications.filter(n => !n.isRead).length;

            setNotifications(fetchedNotifications);
            setUnreadCount(count);
        } catch (error) {
            console.error("Échec de la récupération des notifications:", error);
            // Réinitialiser en cas d'erreur de connexion
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    // Effet pour initialiser et rafraîchir périodiquement
    useEffect(() => {
        fetchNotifications(); // Récupère immédiatement au montage

        // Rafraîchissement périodique (simule le temps réel)
        const intervalId = setInterval(fetchNotifications, FETCH_INTERVAL_MS);

        // Nettoyage de l'intervalle
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    // Fonction pour marquer une notification comme lue (côté client et serveur)
    const markAsRead = async (notificationId) => {
        // Optimistic update côté client
        setNotifications(prevNotifications => 
            prevNotifications.map(n => 
                n._id === notificationId ? { ...n, isRead: true } : n
            )
        );
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        
        try {
            // APPEL API RÉEL : PUT /api/notifications/:id/read
            await api.put(`/api/notifications/${notificationId}/read`);
        } catch (error) {
            console.error("Échec de la mise à jour 'markAsRead' sur le serveur:", error);
        }
    };
    
    // Fonction à utiliser pour envoyer une notification (utilisée par la page d'abonnement après une mise à jour)
    const pushNotification = (newNotification) => {
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        if (!newNotification.isRead) {
            setUnreadCount(prevCount => prevCount + 1);
        }
    };


    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        pushNotification,
        fetchNotifications, 
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Exportation par défaut pour la robustesse des importations dans Next.js
export default NotificationProvider;