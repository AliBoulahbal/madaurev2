// client/components/ui/Input.jsx
import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, className = '', required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madaure-primary focus:border-madaure-primary transition duration-150 ease-in-out ${className}`}
    />
  );
};

export default Input;