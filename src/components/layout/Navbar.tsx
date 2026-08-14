import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/blog', label: 'Blog' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-navy/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex items-center gap-5 relative">
      <Link to="/"><Logo /></Link>

      <div className="ml-auto hidden md:flex items-center gap-7">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="text-bone text-[15px] font-medium hover:text-orbix-cyan">
            {l.label}
          </Link>
        ))}
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 bg-orbix-blue text-bone rounded-xl px-5 py-2.5 font-display font-semibold text-sm hover:bg-orbix-cyan hover:text-navy"
        >
          Ingresar
        </Link>
      </div>

      <button
        aria-label="Abrir menú"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto md:hidden w-10 h-10 grid place-items-center bg-white/5 border border-white/10 rounded-xl text-bone"
      >
        ☰
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 flex flex-col gap-1 p-3 bg-navy/95 border-b border-white/10 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-bone text-base font-medium px-2.5 py-3 rounded-lg">
              {l.label}
            </Link>
          ))}
          <Link to="/admin/login" onClick={() => setOpen(false)} className="bg-orbix-blue text-bone font-display font-semibold text-base px-3.5 py-3 rounded-lg text-center">
            Ingresar
          </Link>
        </div>
      )}
    </div>
  );
}
