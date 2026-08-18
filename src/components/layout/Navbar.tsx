import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { useTheme } from '../../utils/useTheme';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/blog', label: 'Blog' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[15px] font-medium transition-colors duration-150 ${
    isActive ? 'text-orbix-lime' : 'text-bone hover:text-orbix-lime'
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-base font-medium px-2.5 py-3 rounded-lg transition-colors duration-150 ${
    isActive
      ? 'text-orbix-lime bg-orbix-lime/8'
      : 'text-bone hover:text-orbix-lime hover:bg-white/5'
  }`;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="sticky top-0 z-40 bg-navy/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex items-center gap-5 relative">
      <Link to="/"><Logo /></Link>

      <div className="ml-auto hidden md:flex items-center gap-7">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navLinkClass}>
            {l.label}
          </NavLink>
        ))}
        {/* Toggle de tema */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="w-9 h-9 grid place-items-center rounded-xl border border-white/10 text-slate hover:text-orbix-lime hover:border-orbix-lime/40 text-base transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
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
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={mobileNavLinkClass}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
