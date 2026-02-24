import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button 
      className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};