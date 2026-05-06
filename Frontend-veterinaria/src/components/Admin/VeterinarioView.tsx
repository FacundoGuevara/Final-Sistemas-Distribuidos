import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const passwordRequirements = [
  { label: 'Al menos 8 caracteres',  test: (pw: string) => pw.length >= 8 },
  {
    label: 'Al menos 3 de los siguientes:',
    test: (pw: string) => {
      let n = 0;
      if (/[a-z]/.test(pw)) n++;
      if (/[A-Z]/.test(pw)) n++;
      if (/[0-9]/.test(pw)) n++;
      if (/[^a-zA-Z0-9]/.test(pw)) n++;
      return n >= 3;
    },
  },
];

function getInitials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const inputBase =
  'w-full px-4 py-2.5 bg-clinic-50 border border-clinic-200 rounded-xl text-slate-800 placeholder-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-clinic-400/40 focus:bg-white transition-all';

const VeterinarioView: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [baristas, setBaristas] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState([false, false]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        setBaristas(await apiService.getBaristas(token));
      } catch {
        setError('Error al cargar veterinarios');
      }
    })();
  }, [getAccessToken]);

  useEffect(() => {
    setValidations(passwordRequirements.map((r) => r.test(password)));
  }, [password]);

  const validateEmail = (v: string) => /.+@.+\..+/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateEmail(email)) { setError('El correo no es válido.'); return; }
    if (!validations.every(Boolean)) { setError('La contraseña no cumple los requisitos.'); return; }
    setLoading(true);
    try {
      const token = await getAccessToken();
      const nuevo = await apiService.createBarista(email, password, token, nombre);
      setBaristas((prev) => [...prev, nuevo]);
      setSuccess('¡Veterinario creado exitosamente!');
      setEmail(''); setPassword(''); setNombre('');
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError('Error al crear veterinario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-clinic-900">Veterinarios</h2>
        <p className="text-slate-500 text-sm">Equipo con acceso al panel de turnos</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* List */}
        <div className="bg-white rounded-2xl border border-clinic-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-clinic-50">
            <h3 className="font-semibold text-clinic-900 text-sm">
              Equipo registrado
              <span className="ml-2 bg-clinic-100 text-clinic-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {baristas.length}
              </span>
            </h3>
          </div>

          {baristas.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <p className="text-slate-500 text-sm">No hay veterinarios registrados</p>
            </div>
          ) : (
            <div className="divide-y divide-clinic-50">
              {baristas.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clinic-500 to-medblue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(b.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{b.name}</p>
                    <p className="text-xs text-slate-500 truncate">{b.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-clinic-100 shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-clinic-900">Agregar veterinario</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-clinic-600 uppercase tracking-wider">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Dr. Juan Pérez"
                className={inputBase}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-clinic-600 uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vet@ejemplo.com"
                className={`${inputBase} ${email && !validateEmail(email) ? 'border-red-400' : ''}`}
              />
              {email && !validateEmail(email) && (
                <p className="text-xs text-red-500 font-medium">Correo inválido</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-clinic-600 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {password && (
                <div className="bg-clinic-50 rounded-xl p-3 space-y-1.5 mt-2">
                  {[
                    { ok: validations[0], label: 'Al menos 8 caracteres' },
                    { ok: /[a-z]/.test(password), label: 'Minúsculas (a–z)' },
                    { ok: /[A-Z]/.test(password), label: 'Mayúsculas (A–Z)' },
                    { ok: /[0-9]/.test(password), label: 'Números (0–9)' },
                    { ok: /[^a-zA-Z0-9]/.test(password), label: 'Caracteres especiales' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${r.ok ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                        {r.ok ? '✓' : '×'}
                      </span>
                      <span className={`text-xs ${r.ok ? 'text-green-700' : 'text-red-500'}`}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span>✓</span> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clinic-600 hover:bg-clinic-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all"
            >
              {loading ? 'Creando...' : 'Crear Veterinario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VeterinarioView;
