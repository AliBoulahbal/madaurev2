// client/lib/api.js - VERSION CORRIGÉE
import axios from 'axios';

// 1. Définition de l'URL de Base
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

/**
 * Fonction pour mapper les anciennes routes vers les nouvelles routes
 */
const mapEndpoint = (endpoint) => {
  // Mappage des routes d'authentification
  if (endpoint === '/auth/login') return '/users/login';
  if (endpoint === '/auth/register') return '/users/register';
  // Ajoutez d'autres mappings si nécessaire
  return endpoint;
};

/**
 * Instance Axios pré-configurée
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Stocker le token
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (!token) {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ==========================================================
// Intercepteur de Requête avec mapping des routes
// ==========================================================
api.interceptors.request.use(
  (config) => {
    // Mapper l'endpoint si nécessaire
    config.url = mapEndpoint(config.url);
    
    // Ajouter le token d'authentification
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const token = user?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            authToken = token;
          }
        }
      } catch (e) {
        console.error("Erreur de lecture du token:", e);
      }
    }
    
    // Log pour debug
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// Intercepteur de Réponse
// ==========================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Erreurs d'authentification
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Token expiré ou invalide. Déconnexion...');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        authToken = null;
        window.location.href = '/login';
      }
    }
    
    // Log détaillé pour debug
    if (error.response) {
      console.error(`[API Error] ${error.response.status}: ${error.response.config?.url}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('[API Error] Pas de réponse du serveur');
    } else {
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);