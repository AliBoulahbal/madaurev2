// client/contexts/AuthContext.jsx
'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
// Importation de l'instance API et de la nouvelle fonction setAuthToken
import { api, setAuthToken } from '@/lib/api'; 

const AuthContext = createContext();

// Hook personnalisé pour un accès facile (Exportation nommée)
export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    // L'objet utilisateur stocké après connexion.
    const [user, setUser] = useState(null); 
    // État de chargement initial (vérification de l'auth au démarrage)
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    
                    // ** CORRECTION CLÉ : Initialiser le token JWT dans l'instance Axios **
                    setAuthToken(parsedUser.token); 
                }
            } catch (error) {
                console.error("Erreur de parsing de l'utilisateur stocké:", error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        
        initializeAuth();
    }, []);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Stocke l'objet utilisateur complet (y compris le token)
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            
            // ** CORRECTION CLÉ : Définir le token après le login **
            setAuthToken(response.data.token); 
            
            router.push('/dashboard');
            
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Identifiants invalides ou erreur API.';
                throw new Error(errorMessage);
            } else if (error.request) {
                console.error('Erreur réseau. Le serveur Node/Express est-il démarré ?', error.request);
                throw new Error('Échec de la connexion. Veuillez vérifier que le serveur MADAURE est en ligne.');
            } else {
                console.error('Erreur de configuration de la requête:', error.message);
                throw new Error('Erreur interne lors de la soumission du formulaire.');
            }
        }
    };
    
    // Fonction d'inscription (similaire au login)
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            
            // ** CORRECTION CLÉ : Définir le token après l'inscription **
            setAuthToken(response.data.token); 
            
            router.push('/dashboard');
            
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || "Erreur d'inscription. L'utilisateur existe peut-être déjà.";
                throw new Error(errorMessage);
            } else if (error.request) {
                throw new Error('Échec de la connexion. Veuillez vérifier que le serveur MADAURE est en ligne.');
            } else {
                throw new Error('Erreur interne lors de la soumission du formulaire.');
            }
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // ** CORRECTION CLÉ : Effacer le token global **
        setAuthToken(null); 
        router.push('/login');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
            {/* Rend les enfants uniquement lorsque l'état d'authentification a été vérifié */}
            {!loading && children}
        </AuthContext.Provider>
    );
};