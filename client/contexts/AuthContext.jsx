// client/contexts/AuthContext.jsx
'use client';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; 
// =======================================================================
// SUBSTITUTION DES IMPORTS NON RÉSOLUS (À RETIRER EN PRODUCTION)
// =======================================================================
// import { useRouter } from 'next/navigation'; // Remplacé par mock
const useRouter = () => ({ push: (path) => console.log('Navigation simulée vers:', path) });

// import { api, setAuthToken } from '@/lib/api'; // Remplacé par mocks
const api = {
    post: (url, data) => {
        // Simule une réponse Admin si l'email est 'admin@test.com'
        if (url.includes('/login') && data.email === 'admin@test.com') {
             return Promise.resolve({ 
                 data: { 
                    _id: 'admin-id-123', 
                    name: 'Admin Test', 
                    email: 'admin@test.com', 
                    role: 'admin', 
                    token: 'mock-admin-token' 
                 } 
             });
        }
        // Simule une réponse Student par défaut
        if (url.includes('/login')) {
            return Promise.resolve({ 
                data: { 
                   _id: 'student-id-456', 
                   name: 'Student Test', 
                   email: 'student@test.com', 
                   role: 'student', 
                   token: 'mock-student-token' 
                } 
            });
        }
        return Promise.resolve({ data: {} });
    }
};
const setAuthToken = (token) => console.log('Token API set:', token ? 'YES' : 'NO');

// import { jwtDecode } from 'jwt-decode'; // Remplacé par mock
const jwtDecode = (token) => ({ exp: Date.now() / 1000 + 3600 }); // Simule un token valide pendant 1 heure
// =======================================================================

const AuthContext = createContext();

// Hook personnalisé pour un accès facile (Exportation nommée)
export function useAuth() {
    return useContext(AuthContext);
}

// Fonction pour vérifier l'expiration du token
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        // Le token est expiré si la date actuelle (en secondes) est supérieure à la date d'expiration (exp)
        return decoded.exp < Date.now() / 1000;
    } catch (e) {
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    // Fonction de vérification d'authentification réutilisable
    const checkAuth = useCallback(() => {
        let isAuthenticated = false;
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                
                if (isTokenExpired(parsedUser.token)) {
                    // Si le token est expiré, déconnexion forcée
                    console.log("Token expiré. Déconnexion forcée.");
                    logout(); 
                    return;
                }

                setUser(parsedUser);
                setAuthToken(parsedUser.token);
                isAuthenticated = true;

                // LOGIQUE CLÉ : Vérification du rôle stocké
                console.log(`Utilisateur initialisé. Rôle: ${parsedUser.role}`);

            }
        } catch (error) {
            console.error("Erreur de parsing de l'utilisateur stocké:", error);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
        return isAuthenticated;
    // Ajout de 'logout' dans les dépendances car il est appelé ici
    }, [router]); 
    
    // Initialisation et vérification du token au montage
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const userData = response.data;
            
            // Stockage et mise à jour de l'état
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setAuthToken(userData.token); 
            
            // Redirection
            router.push('/dashboard');
            
            return userData;
        } catch (error) {
            // Logique d'erreur
            const errorMessage = error.response?.data?.message || 'Échec de la connexion. Vérifiez les informations.';
            throw new Error(errorMessage);
        }
    };

    // Fonction d'inscription (laissée simple car non le focus principal)
    const register = async (name, email, password, branch) => {
        try {
            const response = await api.post('/api/auth/register', { name, email, password, branch });
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

    // Fonction de déconnexion (LOGOUT)
    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setAuthToken(null); 
        setUser(null);
        // La redirection se fait vers /login
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

export default AuthProvider; // Exportation par défaut pour une meilleure compatibilité d'importation