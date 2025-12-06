// client/components/ui/Input.jsx
import React from 'react';

/**
 * Composant de champ de saisie (Input) thémé avec MADAURE.
 * Utilise l'opérateur de propagation pour s'assurer que les props
 * (name, value, onChange, required, etc.) sont bien transmises au tag <input> natif.
 */
const Input = ({ className = '', ...props }) => {
  return (
    <input
      // Propagation de toutes les props reçues (type, name, value, onChange, placeholder, etc.)
      {...props}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madaure-primary focus:border-madaure-primary transition duration-150 ease-in-out ${className}`}
    />
  );
};

export default Input;