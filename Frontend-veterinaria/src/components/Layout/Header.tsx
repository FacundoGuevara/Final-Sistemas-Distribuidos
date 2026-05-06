import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../Auth/LogoutButton";
import LoginButton from "../Auth/LoginButton";

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Header: React.FC = () => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/menu",        label: "Servicios",        show: true },
    { href: "/mis-pedidos", label: "Mis Turnos",        show: hasRole("cliente") },
    { href: "/pedidos",     label: "Todos los Turnos",  show: hasRole("veterinario") },
    { href: "/admin",       label: "Administración",    show: hasRole("admin") },
  ].filter((l) => l.show);

  const navCls = (path: string) =>
    router.pathname === path
      ? "bg-white text-clinic-800 shadow-sm font-semibold"
      : "text-white/70 hover:text-white hover:bg-white/10";

  return (
    <header className="sticky top-0 z-40 shadow-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-clinic-400 via-teal-300 to-medblue-500" />

      {/* Main bar */}
      <div
        className="bg-gradient-to-r from-clinic-900 via-clinic-800 to-medblue-900"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center group-hover:bg-white/25 transition-all duration-200 shadow-inner">
                <span className="text-lg leading-none">🩺</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[26px] font-extrabold text-white tracking-tight leading-none">VetOnline</span>
                <span className="text-[9px] font-semibold text-clinic-300 uppercase tracking-[0.18em] mt-0.5">Clínica Veterinaria</span>
              </div>
            </Link>

            {/* Desktop nav */}
            {isAuthenticated ? (
              <nav className="hidden md:flex items-center gap-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${navCls(l.href)}`}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Divider + user */}
                <div className="ml-3 pl-3 border-l border-white/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-clinic-600/70 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold select-none">
                    {getInitials(user?.name)}
                  </div>
                  <span className="text-sm text-white/80 font-medium max-w-[110px] truncate">
                    {user?.name}
                  </span>
                  <LogoutButton />
                </div>
              </nav>
            ) : (
              <div className="hidden md:flex">
                <LoginButton />
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-clinic-900/95 backdrop-blur-md border-t border-white/10 fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${navCls(l.href)}`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between px-4 py-3 mt-1 border-t border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-clinic-600/70 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user?.name)}
                    </div>
                    <span className="text-sm text-white/80 font-medium">{user?.name}</span>
                  </div>
                  <LogoutButton />
                </div>
              </>
            ) : (
              <div className="px-2 py-2">
                <LoginButton />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
