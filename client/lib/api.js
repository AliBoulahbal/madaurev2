// client/lib/api.js

import axios from 'axios';

// 1. Définition de l'URL de Base
// L'URL est tirée du .env.local (NEXT_PUBLIC_BACKEND_URL)
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Instance Axios pré-configurée pour interagir avec le Backend MADAURE.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Le Content-Type est essentiel pour que Express puisse parser le JSON
    'Content-Type': 'application/json',
  },
  // Permet d'inclure les cookies si nécessaire (bien que nous utilisions JWT dans localStorage)
  withCredentials: true, 
});

// Stocker le token dans une variable accessible par les intercepteurs (solution plus propre)
let authToken = null;

/**
 * Fonction publique appelée par AuthContext pour définir le JWT après login/register
 * @param {string | null} token - Le jeton JWT ou null pour déconnexion
 */
export const setAuthToken = (token) => {
    authToken = token;
    
    // Si le token est null, on efface aussi l'en-tête global
    if (!token) {
        delete api.defaults.headers.common['Authorization'];
    }
};

// ==========================================================
// 2. Intercepteur de Requête (Ajout du Token)
// ==========================================================
api.interceptors.request.use(
  (config) => {
    
    // ** CORRECTION CLÉ : Utiliser la variable globale authToken **
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else if (typeof window !== 'undefined') {
        // Fallback: Tentative de récupération depuis localStorage pour les rafraîchissements
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                const token = user?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    authToken = token; // Mise à jour de la variable globale pour les requêtes futures
                }
            }
        } catch (e) {
            console.error("Erreur de lecture/parsing du token dans localStorage:", e);
        }
    }
    
    if (!config.headers.Authorization && config.url !== '/auth/login' && config.url !== '/auth/register') {
        console.warn(`[API] Requête vers ${config.url} sans JWT.`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// 3. Intercepteur de Réponse (Gestion des Erreurs Globales)
// ==========================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    // Vérifie si l'erreur est liée à l'authentification (401 Unauthorized ou 403 Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      console.error('API Error 401/403: Token expiré ou invalide. Tentative de déconnexion.');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login'; 
      }
    }

    // Renvoie l'erreur pour qu'elle puisse être gérée par le `try...catch` du composant
    return Promise.reject(error);
  }
);