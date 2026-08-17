import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ScrollCue } from '../components/ui/ScrollCue';
import { getMembers } from '../firebase/members';
import type { Member, Discipline } from '../firebase/members';

const disciplines: ('Todos' | Discipline)[] = ['Todos', 'Frontend', 'Backend', 'Full-Stack', 'Diseño', 'DevOps', 'QA'];

const values = [
  { title: 'Innovación', desc: 'Buscamos soluciones nuevas antes que las conocidas por defecto.' },
  { title: 'Excelencia técnica', desc: 'Cuidamos la calidad del código como si fuera a producción.' },
  { title: 'Colaboración', desc: 'Construimos en equipo, revisamos y aprendemos juntos.' },
  { title: 'Aprendizaje continuo', desc: 'Cada proyecto es una oportunidad para mejorar el criterio técnico.' },
  { title: 'Compromiso', desc: 'Cumplimos lo que prometemos, dentro y fuera del aula.' },
];

export function Nosotros() {
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [discipline, setDiscipline] = useState<'Todos' | Discipline>('Todos');

  useEffect(() => {
    getMembers()
      .then(setTeam)
      .finally(() => setLoading(false));
  }, []);

  const visible = discipline === 'Todos' ? team : team.filter((m) => m.discipline === discipline);

  return (
    <div>
      <section className="orbit-hero orbit-mesh-bg relative border-b border-white/10 px-8 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <span className="orbit-enter orbit-enter-1 block text-sm font-semibold tracking-widest text-orbix-violet uppercase">Nosotros</span>
          <h1 className="orbit-enter orbit-enter-2 font-display font-bold text-5xl mt-3 mb-4">El equipo detrás de ORBIX</h1>
          <p className="orbit-enter orbit-enter-3 text-lg text-slate max-w-2xl">
            Somos un grupo de estudiantes que decidimos tratar cada proyecto académico como si fuera un proyecto real, con los mismos estándares de calidad de la industria.
          </p>
        </div>
        <ScrollCue />
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2 className="font-display font-bold text-3xl">Integrantes</h2>
          <div className="flex gap-2 flex-wrap">
            {disciplines.map((d) => (
              <button
                key={d}
                onClick={() => setDiscipline(d)}
                className={`rounded-full px-4 py-2 text-sm font-medium border ${
                  discipline === d ? 'bg-orbix-violet border-orbix-violet text-bone' : 'bg-transparent border-white/15 text-slate'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 animate-pulse h-52" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-slate text-center py-20 border border-dashed border-white/10 rounded-2xl">
            {team.length === 0
              ? 'Aún no hay integrantes registrados. Cada miembro puede completar su perfil desde el panel de admin.'
              : 'No hay integrantes con esta disciplina.'}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((m, i) => (
              <div key={m.uid} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 relative">
                <span className="absolute top-5 right-6 text-xs font-mono text-slate">{String(i + 1).padStart(2, '0')}</span>
                {m.photoUrl ? (
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover mb-4 border border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orbix-violet to-orbix-lime mb-4" />
                )}
                <div className="font-display font-semibold">{m.name}</div>
                <div className="text-sm text-orbix-lime mt-1">{m.role}</div>
                {m.orbit && (
                  <>
                    <div className="text-xs text-slate mt-3 uppercase tracking-wide">Órbita</div>
                    <div className="text-sm text-slate">{m.orbit}</div>
                  </>
                )}
                <div className="flex items-center gap-3 mt-4">
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noreferrer" aria-label="GitHub"
                      className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-orbix-lime">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A10.5 10.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>
                      GitHub
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                      className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-orbix-lime">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
        <h2 className="font-display font-bold text-3xl mb-5">¿Quieres trabajar con nosotros?</h2>
        <Link to="/contacto"><Button variant="primary">Ir a contacto</Button></Link>
      </section>
    </div>
  );
}
