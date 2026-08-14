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
            <Link to="/" className="hover:text-orbix-cyan">Inicio</Link>
            <Link to="/blog" className="hover:text-orbix-cyan">Blog</Link>
            <Link to="/nosotros" className="hover:text-orbix-cyan">Nosotros</Link>
            <Link to="/contacto" className="hover:text-orbix-cyan">Contacto</Link>
          </div>
        </div>
        <div>
          <div className="font-display font-semibold text-sm mb-4 text-bone">Contacto</div>
          <div className="flex flex-col gap-3 text-sm text-slate">
            <span>hola@orbix.studio</span>
            <span>Ciudad Universitaria, Pab. III</span>
            <span>Lun a Vie · 9–18h</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-8 py-5 text-center text-sm text-slate">
        © 2026 ORBIX Studio · Proyecto académico
      </div>
    </div>
  );
}
