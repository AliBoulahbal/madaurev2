// client/hooks/useDeviceUUID.js
'use client';

import { useState, useEffect } from 'react';
import { generateDeviceUUID5 } from '@/lib/utils'; // Importation de la fonction

/**
 * Hook pour obtenir l'UUID de l'appareil après le montage côté client.
 * @returns {string | null} L'UUID de l'appareil.
 */
const useDeviceUUID = () => {
    const [uuid, setUuid] = useState(null);

    useEffect(() => {
        // Exécution uniquement après le montage et s'assurant que 'window' est disponible
        if (typeof window !== 'undefined') {
            const generatedUUID = generateDeviceUUID5();
            setUuid(generatedUUID);
            
            // OPTIONNEL : Stockage dans le localStorage pour persistance
            // if (generatedUUID) {
            //     localStorage.setItem('madaure_device_id', generatedUUID);
            // }
        }
    }, []);

    return uuid;
};

export default useDeviceUUID;