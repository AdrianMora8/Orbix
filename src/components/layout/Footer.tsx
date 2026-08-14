import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <div className="border-t border-white/10 bg-black/20">
      <div className="max-w-6xl mx-auto px-8 py-14 grid gap-9" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        <div className="max-w-xs">
          <Logo />
          <p className="text-sm text-slate mt-4">Código con propósito. Estudio universitario de desarrollo de software.</p>
        </div>
        <div>
          <div className="font-display font-semibold text-sm mb-4 text-bone">Navegación</div>
          <div className="flex flex-col gap-3 text-sm text-slate">
            <Link to="/" className="hover:text-orbix-lime">Inicio</Link>
            <Link to="/servicios" className="hover:text-orbix-lime">Servicios</Link>
            <Link to="/blog" className="hover:text-orbix-lime">Blog</Link>
            <Link to="/nosotros" className="hover:text-orbix-lime">Nosotros</Link>
            <Link to="/contacto" className="hover:text-orbix-lime">Contacto</Link>
          </div>
        </div>
        <div>
          <div className="font-display font-semibold text-sm mb-4 text-bone">Contacto</div>
          <div className="flex flex-col gap-3 text-sm text-slate">
            <span>hola@orbix.studio</span>
            <span>Ciudad Universitaria, Pab. III</span>
            <span>Lun a Vie · 9–18h</span>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"
              className="w-9 h-9 grid place-items-center border border-white/10 rounded-full text-slate hover:text-orbix-lime hover:border-orbix-lime/40">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A10.5 10.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"
              className="w-9 h-9 grid place-items-center border border-white/10 rounded-full text-slate hover:text-orbix-lime hover:border-orbix-lime/40">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"
              className="w-9 h-9 grid place-items-center border border-white/10 rounded-full text-slate hover:text-orbix-lime hover:border-orbix-lime/40">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-8 py-5 text-center text-sm text-slate">
        © 2026 ORBIX Studio · Proyecto académico
      </div>
    </div>
  );
}
