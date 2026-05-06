import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 py-1.5 px-3 rounded-lg transition-all duration-150"
      title="Cerrar sesión"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Salir
    </button>
  );
};

export default LogoutButton;
