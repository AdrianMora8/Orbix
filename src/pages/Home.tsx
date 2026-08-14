import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getPublishedPosts } from '../firebase/posts';
import type { Post } from '../firebase/posts';
import { formatDate } from '../utils/date';
import { StatusPanel } from '../components/home/StatusPanel';
import { TechOrbit } from '../components/home/TechOrbit';
import { useScrollReveal } from '../utils/useScrollReveal';

const stats = [
  { num: '24', label: 'Proyectos entregados' },
  { num: '18', label: 'Tecnologías dominadas' },
  { num: '12', label: 'Integrantes del equipo' },
  { num: '6', label: 'Semestres activos' },
];

const caseStudies = [
  { title: 'Sistema de gestión académica', desc: 'Plataforma para digitalizar procesos de facultad: matrículas, calificaciones y reportes.', tag: 'Full-Stack' },
  { title: 'App de seguimiento de proyectos', desc: 'Herramienta interna para coordinar sprints y entregas entre equipos del estudio.', tag: 'Producto' },
  { title: 'API de datos abiertos', desc: 'Servicio REST documentado para exponer datasets académicos a terceros.', tag: 'Backend' },
];

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const mission = useScrollReveal<HTMLDivElement>();
  const cases = useScrollReveal<HTMLDivElement>();
  const blogSection = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    getPublishedPosts().then((all) => setPosts(all.slice(0, 3)));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-8 py-28">
        <div className="relative max-w-6xl mx-auto grid gap-10 items-center" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-orbix-cyan/30 rounded-full bg-orbix-cyan/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orbix-cyan" />
              <span className="text-sm text-orbix-cyan">Estudio universitario de desarrollo de software</span>
            </div>
            <h1 className="font-display font-bold text-6xl leading-none tracking-tight mb-5">
              Código con <span className="text-orbix-blue">propósito</span>.
            </h1>
            <p className="text-lg text-slate max-w-xl mb-9">
              Somos ORBIX Studio. Diseñamos y construimos soluciones de software que resuelven problemas reales, aplicando en cada proyecto los estándares de calidad de la industria.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link to="/servicios"><Button variant="primary">Ver servicios</Button></Link>
              <Link to="/nosotros"><Button variant="secondary">Conócenos</Button></Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <StatusPanel />
          </div>
        </div>
      </section>

      <section className="py-14 border-y border-white/10">
        <TechOrbit />
      </section>

      <section ref={mission.ref} className={`${mission.className} max-w-6xl mx-auto px-8 py-16 grid gap-6`} style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-9">
          <h3 className="font-display font-semibold text-2xl mb-3">Misión</h3>
          <p className="text-slate leading-relaxed">Diseñar y construir soluciones de software que resuelven problemas reales, aplicando en cada proyecto académico los estándares de calidad de la industria.</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-9">
          <h3 className="font-display font-semibold text-2xl mb-3">Visión</h3>
          <p className="text-slate leading-relaxed">Ser un equipo referente dentro de la universidad por la calidad técnica y el impacto de nuestros proyectos de desarrollo de software.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-orbix-blue/5">
        <div className="max-w-6xl mx-auto px-8 py-14 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-5xl">{s.num}</div>
              <div className="text-sm text-slate mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={cases.ref} className={`${cases.className} orbit-starfield max-w-6xl mx-auto px-8 py-16`}>
        <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Casos de estudio</span>
        <h2 className="font-display font-bold text-4xl mt-3 mb-9">Proyectos que ya construimos.</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {caseStudies.map((c) => (
            <div key={c.title} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orbix-blue/40 to-orbix-cyan/15" />
              <div className="p-6">
                <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">{c.tag}</span>
                <h3 className="font-display font-semibold text-lg mt-3 mb-2">{c.title}</h3>
                <p className="text-sm text-slate">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={blogSection.ref} className={`${blogSection.className} max-w-6xl mx-auto px-8 py-16`}>
        <div className="flex items-end justify-between gap-5 flex-wrap mb-9">
          <div>
            <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Blog</span>
            <h2 className="font-display font-bold text-4xl mt-3">Últimos posts</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-orbix-cyan border border-orbix-cyan/30 rounded-xl px-5 py-3 font-display font-semibold text-sm">
            Ver todos los posts
          </Link>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="block bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              {p.coverImageUrl ? (
                <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.coverImageUrl})` }} />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-orbix-blue/40 to-orbix-cyan/15" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">{p.tags[0]}</span>
                  <span className="text-xs text-slate">{formatDate(p.createdAt)}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-slate">{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="rounded-3xl p-14 bg-gradient-to-br from-orbix-blue/90 to-orbix-blue/50 border border-orbix-cyan/30">
          <h2 className="font-display font-bold text-4xl mb-3 max-w-md">¿Tenés un proyecto en mente? Hablemos.</h2>
          <p className="text-bone/90 mb-7 max-w-xl">Contanos qué querés construir y te respondemos con una propuesta técnica.</p>
          <Link to="/contacto">
            <Button className="!bg-bone !text-navy hover:!bg-navy hover:!text-bone">Ir a contacto</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
