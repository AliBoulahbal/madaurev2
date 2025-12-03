// client/app/(auth)/layout.jsx

import React from 'react';
// Importez votre logo ici (assurez-vous d'avoir le fichier dans public/logo.png)
import Image from 'next/image';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
        <div className="text-center">
          {/* Remplacez ceci par votre composant Image avec le logo MADAURE */}
          <Image
            src="/logo.png" // Assurez-vous d'ajouter votre logo ici
            alt="MADAURE Logo"
            width={120}
            height={120}
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bienvenue sur MADAURE
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;