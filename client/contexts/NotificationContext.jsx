// client/contexts/NotificationContext.jsx - VERSION PRODUCTION
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api'; 
import { useAuth } from '@/contexts/AuthContext'; 

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  
  return context;
};

const FETCH_INTERVAL_MS = 30000; // Intervalle de 30 secondes pour rafraîchir

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth(); 
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer les notifications depuis l'API
    const fetchNotifications = useCallback(async () => {
        // Vérifie si l'utilisateur est authentifié et disponible
        if (!isAuthenticated || !user || !user._id) { 
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/notifications'); 
            const fetchedNotifications = response.data.notifications || response.data || [];
            
            // Calculer le nombre non lu
            const count = fetchedNotifications.filter(n => !n.isRead).length;

            setNotifications(fetchedNotifications);
            setUnreadCount(count);
        } catch (error) {
            console.error("Échec de la récupération des notifications:", error);
            // En cas d'erreur, garder les notifications existantes
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    // Effet pour initialiser et rafraîchir périodiquement
    useEffect(() => {
        fetchNotifications();

        // Rafraîchissement périodique
        const intervalId = setInterval(fetchNotifications, FETCH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    // Fonction pour marquer une notification comme lue
    const markAsRead = async (notificationId) => {
        // Optimistic update côté client
        setNotifications(prevNotifications => 
            prevNotifications.map(n => 
                n._id === notificationId ? { ...n, isRead: true } : n
            )
        );
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        
        try {
            await api.put(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error("Échec de la mise à jour 'markAsRead':", error);
            // Revert en cas d'erreur
            setNotifications(prevNotifications => 
                prevNotifications.map(n => 
                    n._id === notificationId ? { ...n, isRead: false } : n
                )
            );
            setUnreadCount(prevCount => prevCount + 1);
        }
    };
    
    // Fonction pour ajouter une nouvelle notification
    const pushNotification = (newNotification) => {
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        if (!newNotification.isRead) {
            setUnreadCount(prevCount => prevCount + 1);
        }
    };

    // Fonction pour marquer toutes comme lues
    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
        
        if (unreadIds.length === 0) return;
        
        // Optimistic update
        setNotifications(prevNotifications => 
            prevNotifications.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
        
        try {
            await api.put('/notifications/mark-all-read');
        } catch (error) {
            console.error("Échec de marquer toutes comme lues:", error);
            // Revert en cas d'erreur
            fetchNotifications();
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        pushNotification,
        fetchNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;