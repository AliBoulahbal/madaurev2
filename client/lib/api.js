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
    'Content-Type': 'application/json',
  },
  // Permet d'inclure les cookies si nécessaire (bien que nous utilisions JWT dans localStorage)
  withCredentials: true, 
});

// ==========================================================
// 2. Intercepteur de Requête (Ajout du Token)
// ==========================================================
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage.
    // NOTE: Nous supposons que le token JWT est stocké directement (sans l'objet utilisateur entier).
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (token) {
      // Ajoute le token à l'en-tête Authorization pour toutes les requêtes
      config.headers.Authorization = `Bearer ${token}`;
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
    // Les réponses réussies sont passées directement
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Vérifie si l'erreur est liée à l'authentification (401 Unauthorized ou 403 Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      console.error('API Error 401/403: Token expiré ou invalide. Déconnexion forcée.');
      
      // Assurez-vous d'exécuter la déconnexion côté client (dans le navigateur)
      if (typeof window !== 'undefined' && !originalRequest._retry) {
          // Pour éviter les boucles infinies de déconnexion si l'intercepteur s'active plusieurs fois
          originalRequest._retry = true; 
          
          // Déclenche la déconnexion globale
          // NOTE: Nous ne pouvons pas appeler `useAuth` directement ici. 
          // La solution la plus simple est de forcer la suppression du token 
          // et de rediriger, et de laisser AuthContext s'en rendre compte.
          localStorage.removeItem('user');
          
          // Redirection vers la page de connexion (si elle existe)
          // La redirection doit être gérée par le contexte/router de Next.js pour être propre.
          // Pour un simple reset dans l'intercepteur :
          window.location.href = '/login'; 
      }
    }

    // Renvoie l'erreur pour qu'elle puisse être gérée par le `try...catch` du composant
    return Promise.reject(error);
  }
);