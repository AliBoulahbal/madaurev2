// client/lib/utils.js

import { v5 as uuidv5 } from "uuid";

/**
 * Génère un UUID version 5 basé sur des propriétés d'appareil (fingerprinting léger).
 * * L'UUID v5 garantit que pour les mêmes entrées (deviceKeyParts), 
 * le même UUID sera généré.
 * @returns {string} L'UUID généré.
 */
export const generateDeviceUUID5 = () => {
    // Namespace privé pour le domaine MADAURE. Doit rester constant.
    const NAMESPACE = '10c91f6e-4b5f-4b0c-9b5f-9d9c8b8a0a0a';
    
    // Assurez-vous d'exécuter ceci uniquement côté client
    if (typeof window === 'undefined') {
        return null; 
    }

    const deviceKeyParts = [
        navigator.userAgent,          // Type de navigateur et OS
        navigator.language,           // Langue du navigateur
        navigator.hardwareConcurrency || '', // Nombre de cœurs CPU (si disponible)
        screen.colorDepth,            // Profondeur de couleur de l'écran
        navigator.maxTouchPoints || '', // Capacité tactile
    ];
    
    // Le v5 est généré en hachant les données et le NAMESPACE
    return uuidv5(deviceKeyParts.join("|"), NAMESPACE);
};

// ... (Autres fonctions utilitaires)