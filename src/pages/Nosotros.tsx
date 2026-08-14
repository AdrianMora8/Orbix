import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const team = [
  { name: 'Integrante 1', role: 'Backend Lead' },
  { name: 'Integrante 2', role: 'Frontend Lead' },
  { name: 'Integrante 3', role: 'DevOps' },
  { name: 'Integrante 4', role: 'QA & Testing' },
];

const values = [
  { title: 'Innovación', desc: 'Buscamos soluciones nuevas antes que las conocidas por defecto.' },
  { title: 'Excelencia técnica', desc: 'Cuidamos la calidad del código como si fuera a producción.' },
  { title: 'Colaboración', desc: 'Construimos en equipo, revisamos y aprendemos juntos.' },
  { title: 'Aprendizaje continuo', desc: 'Cada proyecto es una oportunidad para mejorar el criterio técnico.' },
  { title: 'Compromiso', desc: 'Cumplimos lo que prometemos, dentro y fuera del aula.' },
];

export function Nosotros() {
  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Nosotros</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4">El equipo detrás de ORBIX</h1>
          <p className="text-lg text-slate max-w-2xl">
            Somos un grupo de estudiantes que decidimos tratar cada proyecto académico como si fuera un proyecto real, con los mismos estándares de calidad de la industria.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="font-display font-bold text-3xl mb-8">Integrantes</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {team.map((m) => (
            <div key={m.name} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orbix-blue to-orbix-cyan mx-auto mb-4" />
              <div className="font-display font-semibold">{m.name}</div>
              <div className="text-sm text-slate mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="font-display font-bold text-3xl mb-8">Nuestros valores</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {values.map((v) => (
            <div key={v.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="font-display font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-slate">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-20 text-center">
        <h2 className="font-display font-bold text-3xl mb-5">¿Querés trabajar con nosotros?</h2>
        <Link to="/contacto"><Button variant="primary">Ir a contacto</Button></Link>
      </section>
    </div>
  );
}
