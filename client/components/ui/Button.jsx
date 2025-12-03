// client/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  let baseStyles = "px-4 py-2 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75";
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-madaure-primary text-white hover:bg-madaure-dark focus:ring-madaure-primary';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'outline':
      variantStyles = 'bg-white border-2 border-madaure-primary text-madaure-primary hover:bg-madaure-light hover:text-white focus:ring-madaure-primary';
      break;
    default:
      variantStyles = 'bg-madaure-primary text-white hover:bg-madaure-dark focus:ring-madaure-primary';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;