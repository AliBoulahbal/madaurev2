// client/contexts/AuthContext.jsx
'use client';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; 
// =======================================================================
// IMPORTATIONS DE PRODUCTION
// Ces imports doivent être résolus par votre configuration Next.js/Webpack.
// =======================================================================
import { useRouter } from 'next/navigation';
import { api, setAuthToken } from '@/lib/api'; // Dépendances de votre API
// =======================================================================

const AuthContext = createContext();

// Hook personnalisé pour un accès facile
export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    const checkAuth = useCallback(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setAuthToken(parsedUser.token); 
            }
        } catch (error) {
            console.error("Erreur de parsing de l'utilisateur stocké:", error);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Fonction de Connexion
    const login = async (email, password) => {
    try {
        // CORRECTION: Enlever "/api" du début
        const response = await api.post('/auth/login', { email, password });
        const userData = response.data;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setAuthToken(userData.token); 
        
        router.push('/dashboard');
        
        return userData;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "بيانات الإتصال خاطئة.";
        throw new Error(errorMessage);
    }
};

// Fonction d'inscription - CORRECTION
const register = async (name, email, password, branch) => {
    try {
        // CORRECTION: Enlever "/api" du début
        const response = await api.post('/auth/register', { name, email, password, branch });
        const userData = response.data;

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setAuthToken(userData.token); 
        
        router.push('/dashboard');
        
        return userData;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erreur d'inscription. L'utilisateur existe peut-être déjà.";
        throw new Error(errorMessage);
    }
};

    // Fonction de déconnexion
    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setAuthToken(null); 
        setUser(null);
        router.push('/login');
    }, [router]);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, checkAuth }}>
            {/* Rendu conditionnel si pas en chargement */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

export default AuthProvider;