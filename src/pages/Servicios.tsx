import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const services = [
  {
    num: '01',
    title: 'Desarrollo web a medida',
    summary: 'Aplicaciones web modernas, listas para escalar.',
    detail: 'Construimos front-end reactivo y back-end sólido a partir de los requisitos reales del proyecto, sin plantillas genéricas. Cada decisión técnica se documenta y se justifica.',
    stack: ['React', 'TypeScript', 'Node.js'],
  },
  {
    num: '02',
    title: 'Aplicaciones móviles',
    summary: 'Apps multiplataforma con foco en experiencia de uso.',
    detail: 'Desarrollamos apps híbridas o nativas según el caso, priorizando rendimiento y una interfaz consistente entre iOS y Android.',
    stack: ['Flutter', 'React Native'],
  },
  {
    num: '03',
    title: 'APIs y arquitectura de back-end',
    summary: 'Servicios documentados y probados de punta a punta.',
    detail: 'Diseñamos arquitecturas limpias y APIs REST claras, con pruebas automatizadas y documentación pensada para que otro equipo pueda continuar el trabajo.',
    stack: ['Python', 'PostgreSQL', 'Docker'],
  },
  {
    num: '04',
    title: 'Diseño UI/UX',
    summary: 'Sistemas de diseño reutilizables entre proyectos.',
    detail: 'Wireframes, prototipos navegables y validación con usuarios reales antes de escribir una sola línea de código.',
    stack: ['Figma', 'Design Systems'],
  },
  {
    num: '05',
    title: 'Consultoría técnica',
    summary: 'Criterio para decisiones de stack e infraestructura.',
    detail: 'Acompañamos la elección de tecnologías, revisamos arquitecturas existentes y proponemos mejoras concretas, priorizadas por impacto.',
    stack: ['Arquitectura', 'Code review'],
  },
];

const process = [
  { title: 'Descubrimiento', desc: 'Entendemos el problema, el alcance y las restricciones reales del proyecto.' },
  { title: 'Diseño', desc: 'Wireframes, sistema visual y arquitectura de la solución antes de programar.' },
  { title: 'Desarrollo', desc: 'Sprints cortos, revisiones de código y entregas incrementales verificables.' },
  { title: 'Entrega', desc: 'Despliegue, documentación y traspaso — el proyecto queda listo para crecer.' },
];

export function Servicios() {
  return (
    <div>
      <section className="orbit-mesh-bg border-b border-white/10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-violet uppercase">Servicios</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4 max-w-2xl">Cinco disciplinas, un mismo criterio técnico.</h1>
          <p className="text-lg text-slate max-w-2xl">
            No vendemos paquetes cerrados. Cada servicio se adapta al problema concreto que tenga el proyecto — esto es lo que cubrimos y cómo lo encaramos.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-14">
        <div className="border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden">
          {services.map((s) => (
            <details key={s.num} className="group open:bg-white/[0.03]">
              <summary className="flex items-center gap-5 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-sm text-orbix-lime flex-none">{s.num}</span>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-slate mt-0.5">{s.summary}</p>
                </div>
                <span className="text-orbix-violet text-xl flex-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6 pl-[3.25rem]">
                <p className="text-slate leading-relaxed mb-4">{s.detail}</p>
                <div className="flex gap-2 flex-wrap">
                  {s.stack.map((t) => (
                    <span key={t} className="text-xs font-mono text-orbix-violet bg-orbix-violet/10 border border-orbix-violet/30 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <span className="text-sm font-semibold tracking-widest text-orbix-violet uppercase">Proceso</span>
          <h2 className="font-display font-bold text-4xl mt-3 mb-10">Cómo trabajamos.</h2>
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
            <div className="flex flex-col gap-10">
              {process.map((p, i) => (
                <div key={p.title} className="relative">
                  <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-navy border-2 border-orbix-lime" />
                  <span className="text-xs font-mono text-slate">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-semibold text-xl mt-1 mb-2">{p.title}</h3>
                  <p className="text-slate leading-relaxed max-w-lg">{p.desc}</p>
                </div>
              ))}
            </div>
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
