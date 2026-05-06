import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold py-2 px-5 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-150 text-sm backdrop-blur-sm"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      Iniciar Sesión
    </button>
  );
};

export default LoginButton;
