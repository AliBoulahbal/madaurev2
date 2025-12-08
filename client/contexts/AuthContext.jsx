// client/contexts/AuthContext.jsx - VERSION COMPLÈTE AVEC updateUser
'use client';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';

// IMPORT CRITIQUE : Vérifiez que ce fichier existe
let api;
try {
  // Essayez d'importer votre lib/api
  const apiModule = require('@/lib/api');
  api = apiModule.api;
} catch (error) {
  console.warn('⚠️  lib/api non trouvé, création d\'une API mock');
  // Fallback si lib/api n'existe pas
  api = {
    post: async (endpoint, data) => {
      console.log('📤 Mock API call to:', endpoint, data);
      
      // Routes corrigées
      let url = '';
      if (endpoint === '/auth/login') {
        url = 'http://localhost:3001/api/users/login';
      } else if (endpoint === '/auth/register') {
        url = 'http://localhost:3001/api/users/register';
      } else {
        url = `http://localhost:3001${endpoint}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw { 
          response: { 
            data: { message: errorText } 
          } 
        };
      }
      
      return { data: await response.json() };
    },
    put: async (endpoint, data) => {
      console.log('📤 Mock PUT API call to:', endpoint, data);
      
      let url = `http://localhost:3001${endpoint}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw { 
          response: { 
            data: { message: errorText } 
          } 
        };
      }
      
      return { data: await response.json() };
    },
    get: async (endpoint) => {
      console.log('📤 Mock GET API call to:', endpoint);
      
      let url = `http://localhost:3001${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw { 
          response: { 
            data: { message: errorText } 
          } 
        };
      }
      
      return { data: await response.json() };
    }
  };
}

const AuthContext = createContext();

// Hook personnalisé pour un accès facile
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
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
                // setAuthToken si disponible
                if (typeof setAuthToken === 'function') {
                    setAuthToken(parsedUser.token); 
                }
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

    // Fonction de Connexion - CORRIGÉE
    const login = async (email, password) => {
        setLoading(true);
        try {
            console.log('🔗 Tentative de connexion...');
            
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('📡 Statut réponse:', response.status);
            
            if (!response.ok) {
                let errorMessage = 'Échec de la connexion';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = await response.text() || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const userData = await response.json();
            console.log('✅ Connexion réussie:', userData);
            
            // Stocker dans localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.token);
            
            // Mettre à jour l'état
            setUser(userData);
            
            // Redirection selon le rôle
            if (userData.role === 'admin' || userData.role === 'teacher') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
            
            return userData;
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fonction d'inscription - CORRIGÉE
    const register = async (name, email, password, branch) => {
        setLoading(true);
        try {
            console.log('📝 Tentative d\'inscription...');
            
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password, branch: branch || 'Science' }),
            });

            console.log('📡 Statut réponse inscription:', response.status);
            
            if (!response.ok) {
                let errorMessage = 'Échec de l\'inscription';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = await response.text() || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const userData = await response.json();
            console.log('✅ Inscription réussie:', userData);
            
            // Stocker dans localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.token);
            
            // Mettre à jour l'état
            setUser(userData);
            
            router.push('/dashboard');
            
            return userData;
        } catch (error) {
            console.error('❌ Erreur d\'inscription:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // FONCTION UPDATEUSER - CRITIQUE POUR SubscriptionPage
    const updateUser = useCallback(async (userData) => {
        try {
            console.log('🔄 Mise à jour de l\'utilisateur:', userData);
            
            if (!userData || typeof userData !== 'object') {
                console.error('❌ Données utilisateur invalides pour updateUser');
                return;
            }

            // Mettre à jour l'état local
            setUser(prev => {
                const updatedUser = { ...prev, ...userData };
                
                // Mettre à jour localStorage
                try {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error('Erreur lors de la mise à jour de localStorage:', error);
                }
                
                return updatedUser;
            });

        } catch (error) {
            console.error('❌ Erreur dans updateUser:', error);
            throw error;
        }
    }, []);

    // Fonction pour récupérer les données utilisateur fraîches
    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:3001/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return userData;
            }
        } catch (error) {
            console.error('❌ Erreur lors du rafraîchissement de l\'utilisateur:', error);
        }
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    }, [router]);

    const isAuthenticated = !!user;

    const value = {
        user, 
        loading, 
        login, 
        register, 
        logout, 
        isAuthenticated, 
        checkAuth,
        updateUser, // AJOUTÉ
        refreshUser, // AJOUTÉ
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;