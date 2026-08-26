import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ScrollCue } from '../components/ui/ScrollCue';
import { useScrollReveal } from '../utils/useScrollReveal';

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
  const list = useScrollReveal<HTMLDivElement>();
  const timeline = useScrollReveal<HTMLDivElement>();

  return (
    <div>
      <section className="orbit-hero orbit-mesh-bg relative border-b border-white/10 px-8 flex items-center overflow-hidden">
        {/* Ilustración decorativa */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none select-none hidden lg:flex items-center justify-center opacity-55" aria-hidden>
          <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
            {/* Ventana */}
            <rect x="40" y="60" width="400" height="360" rx="18" fill="#0A0A12" />
            {/* Barra superior */}
            <rect x="40" y="60" width="400" height="44" rx="18" fill="#B6FF3C" />
            <circle cx="72" cy="82" r="8" fill="#0A0A12" opacity="0.4"/>
            <circle cx="100" cy="82" r="8" fill="#0A0A12" opacity="0.4"/>
            <circle cx="128" cy="82" r="8" fill="#0A0A12" opacity="0.4"/>
            {/* Pestaña / nombre de archivo */}
            <rect x="300" y="70" width="118" height="24" rx="12" fill="white" opacity="0.12" />
            <text x="314" y="87" fontFamily="monospace" fontSize="12" fill="#0A0A12" opacity="0.7">servicios.json</text>
            {/* Números de línea */}
            <g fontFamily="monospace" fontSize="11" fill="#B6FF3C" opacity="0.35">
              <text x="58" y="132">1</text>
              <text x="58" y="162">2</text>
              <text x="58" y="192">3</text>
              <text x="58" y="222">4</text>
              <text x="58" y="252">5</text>
              <text x="58" y="282">6</text>
              <text x="58" y="312">7</text>
              <text x="58" y="342">8</text>
              <text x="58" y="372">9</text>
            </g>
            {/* Contenido JSON: las 5 disciplinas */}
            <g fontFamily="monospace" fontSize="14">
              <text x="84" y="132" fill="white">{"{"}</text>
              <text x="84" y="162"><tspan fill="#B6FF3C">"servicios"</tspan><tspan fill="white">: [</tspan></text>
              <text x="100" y="192"><tspan fill="white">{"{ "}</tspan><tspan fill="#B6FF3C">"01"</tspan><tspan fill="white">: </tspan><tspan fill="#E2E8F0">"Web a medida"</tspan><tspan fill="white">{" },"}</tspan></text>
              <text x="100" y="222"><tspan fill="white">{"{ "}</tspan><tspan fill="#B6FF3C">"02"</tspan><tspan fill="white">: </tspan><tspan fill="#E2E8F0">"Apps móviles"</tspan><tspan fill="white">{" },"}</tspan></text>
              <text x="100" y="252"><tspan fill="white">{"{ "}</tspan><tspan fill="#B6FF3C">"03"</tspan><tspan fill="white">: </tspan><tspan fill="#E2E8F0">"APIs y Back-end"</tspan><tspan fill="white">{" },"}</tspan></text>
              <text x="100" y="282"><tspan fill="white">{"{ "}</tspan><tspan fill="#B6FF3C">"04"</tspan><tspan fill="white">: </tspan><tspan fill="#E2E8F0">"Diseño UI/UX"</tspan><tspan fill="white">{" },"}</tspan></text>
              <text x="100" y="312"><tspan fill="white">{"{ "}</tspan><tspan fill="#B6FF3C">"05"</tspan><tspan fill="white">: </tspan><tspan fill="#E2E8F0">"Consultoría"</tspan><tspan fill="white">{" }"}</tspan></text>
              <text x="84" y="342" fill="white">]</text>
              <text x="84" y="372" fill="white">{"}"}</text>
              {/* Cursor del editor */}
              <rect x="96" y="374" width="8" height="13" fill="#B6FF3C" />
            </g>
          </svg>
        </div>
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <span className="orbit-enter orbit-enter-1 block text-sm font-semibold tracking-widest text-orbix-violet uppercase">Servicios</span>
          <h1 className="orbit-enter orbit-enter-2 font-display font-bold text-5xl mt-3 mb-4 max-w-2xl">Cinco disciplinas, un mismo criterio técnico.</h1>
          <p className="orbit-enter orbit-enter-3 text-lg text-slate max-w-2xl">
            No vendemos paquetes cerrados. Cada servicio se adapta al problema concreto que tenga el proyecto — esto es lo que cubrimos y cómo lo encaramos.
          </p>
        </div>
        <ScrollCue />
      </section>

      <section ref={list.ref} className={`${list.className} max-w-4xl mx-auto px-8 py-14`}>
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

      <section ref={timeline.ref} className={`${timeline.className} border-t border-white/10 bg-white/[0.02]`}>
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
