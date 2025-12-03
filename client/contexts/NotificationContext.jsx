// client/contexts/NotificationContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api'; // Votre instance Axios préconfigurée

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fonction pour charger les notifications et le compteur
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: notifData } = await api.get('/notifications');
      setNotifications(notifData);
      
      const unreadCount = notifData.filter(n => !n.isRead).length;
      setUnreadCount(unreadCount);
      
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      
      // Mise à jour locale de l'état
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
      
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };
  
  // Utiliser `useAuth` pour s'assurer que l'utilisateur est connecté avant de fetcher

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default function useNotifications() {
  return useContext(NotificationContext);
}