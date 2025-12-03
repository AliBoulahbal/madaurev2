// client/contexts/AuthContext.jsx
"use client";
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'; // Nous allons créer ce fichier dans l'étape suivante

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Vérifie si l'utilisateur est déjà connecté (via localStorage/cookies)
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            
            // Stocke l'utilisateur et le token
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            
            // Redirige vers le tableau de bord
            router.push('/dashboard');
            
            return data;
        } catch (error) {
            // Affiche l'erreur (à améliorer avec le composant Alert.jsx)
            console.error('Login failed:', error.response.data.message);
            throw new Error(error.response.data.message || 'Erreur de connexion');
        }
    };
    
    // Fonction d'inscription
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            
            // L'inscription connecte immédiatement l'utilisateur
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            
            // Redirige
            router.push('/dashboard');
            
            return data;
        } catch (error) {
            console.error('Registration failed:', error.response.data.message);
            throw new Error(error.response.data.message || "Erreur d'inscription");
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;