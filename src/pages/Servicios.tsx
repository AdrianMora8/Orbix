import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

type Category = 'Todos' | 'Desarrollo' | 'Diseño' | 'Consultoría';

const services: { title: string; desc: string; category: Category }[] = [
  { title: 'Desarrollo web a medida', desc: 'Aplicaciones web modernas con front-end reactivo y back-end sólido, listas para escalar.', category: 'Desarrollo' },
  { title: 'Aplicaciones móviles', desc: 'Apps multiplataforma con foco en rendimiento y experiencia de usuario.', category: 'Desarrollo' },
  { title: 'APIs y back-end', desc: 'Servicios REST y arquitecturas limpias, documentadas y probadas de punta a punta.', category: 'Desarrollo' },
  { title: 'Diseño UI/UX', desc: 'Interfaces claras y consistentes, con sistemas de diseño reutilizables entre proyectos.', category: 'Diseño' },
  { title: 'Prototipado e investigación', desc: 'Wireframes, prototipos navegables y validación con usuarios antes de escribir código.', category: 'Diseño' },
  { title: 'Consultoría y arquitectura', desc: 'Acompañamos decisiones técnicas: stack, infraestructura y buenas prácticas.', category: 'Consultoría' },
];

const categories: Category[] = ['Todos', 'Desarrollo', 'Diseño', 'Consultoría'];

const process = [
  { step: '01', title: 'Descubrimiento', desc: 'Entendemos el problema, el alcance y las restricciones reales del proyecto.' },
  { step: '02', title: 'Diseño', desc: 'Wireframes, sistema visual y arquitectura de la solución antes de programar.' },
  { step: '03', title: 'Desarrollo', desc: 'Sprints cortos, revisiones de código y entregas incrementales verificables.' },
  { step: '04', title: 'Entrega', desc: 'Despliegue, documentación y traspaso — el proyecto queda listo para crecer.' },
];

export function Servicios() {
  const [category, setCategory] = useState<Category>('Todos');
  const visible = category === 'Todos' ? services : services.filter((s) => s.category === category);

  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Servicios</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4">Soluciones que orbitan tu problema real.</h1>
          <p className="text-lg text-slate max-w-2xl">
            Un portafolio de servicios pensado para llevar un proyecto de idea a producto: desarrollo, diseño y criterio técnico bajo un mismo equipo.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex gap-2.5 flex-wrap mb-9">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium border ${
                category === c ? 'bg-orbix-blue border-orbix-blue text-bone' : 'bg-transparent border-white/15 text-slate'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {visible.map((s) => (
            <div key={s.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7">
              <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">{s.category}</span>
              <h3 className="font-display font-semibold text-lg mt-3 mb-2.5">{s.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-orbix-blue/5">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Proceso</span>
          <h2 className="font-display font-bold text-4xl mt-3 mb-10">Cómo trabajamos.</h2>
          <div className="grid gap-6 relative" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {process.map((p) => (
              <div key={p.step} className="relative pl-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full border border-orbix-cyan/40 grid place-items-center font-mono text-xs text-orbix-cyan">{p.step}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="font-display font-bold text-3xl mb-5">¿Con cuál servicio arrancamos?</h2>
        <Link to="/contacto"><Button variant="primary">Hablar con el equipo</Button></Link>
      </section>
    </div>
  );
}
