import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/layout/Logo';
import { useAuth } from '../../firebase/auth';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch {
      setError('Credenciales inválidas.');
    }
  }

  return (
    <div className="orbit-mesh-bg min-h-screen bg-bg flex items-center justify-center px-6 relative">
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-slate hover:text-orbix-lime">
        ← Volver al inicio
      </Link>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-9">
          <Logo variant="icon" />
          <div className="font-display font-bold text-2xl mt-3 text-bone">ORBIX</div>
          <div className="text-sm text-slate mt-1.5">Panel de administración</div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          <label htmlFor="email" className="block text-sm text-slate mb-2">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet mb-5" />
          <label htmlFor="password" className="block text-sm text-slate mb-2">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet mb-6" />
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-orbix-violet text-bone rounded-xl py-3.5 font-display font-semibold">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
