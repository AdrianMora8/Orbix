import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getPublishedPosts } from '../firebase/posts';
import type { Post } from '../firebase/posts';
import { formatDate } from '../utils/date';
import { StatusPanel } from '../components/home/StatusPanel';
import { TechOrbit } from '../components/home/TechOrbit';
import { StatCard } from '../components/home/StatCard';
import { ScrollCue } from '../components/ui/ScrollCue';
import { useScrollReveal } from '../utils/useScrollReveal';

const stats = [
  { num: '24', label: 'Proyectos entregados', icon: 'M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z' },
  { num: '18', label: 'Tecnologías dominadas', icon: 'M9 4 3 12l6 8M15 4l6 8-6 8' },
  { num: '12', label: 'Integrantes del equipo', icon: 'M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2.5 2-4.5 4.5-4.5S23 17.5 23 20' },
  { num: '6', label: 'Semestres activos', icon: 'M4 5h16M6 3v4M18 3v4M4 9h16v11H4V9Z' },
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
      <section className="orbit-hero orbit-mesh-bg relative overflow-hidden px-8 flex items-center">
        <div className="relative max-w-6xl mx-auto grid gap-10 items-center w-full" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <div>
            <div className="orbit-enter orbit-enter-1 inline-flex items-center gap-2 px-3.5 py-1.5 border border-orbix-lime/30 rounded-full bg-orbix-lime/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orbix-lime" />
              <span className="text-sm text-orbix-lime">Estudio universitario de desarrollo de software</span>
            </div>
            <h1 className="orbit-enter orbit-enter-2 font-display font-bold text-6xl leading-none tracking-tight mb-5">
              Código con <span className="text-orbix-violet">propósito</span>.
            </h1>
            <p className="orbit-enter orbit-enter-3 text-lg text-slate max-w-xl mb-9">
              Somos ORBIX Studio. Diseñamos y construimos soluciones de software que resuelven problemas reales, aplicando en cada proyecto los estándares de calidad de la industria.
            </p>
            <div className="orbit-enter orbit-enter-4 flex flex-wrap gap-3.5">
              <Link to="/servicios"><Button variant="primary">Ver servicios</Button></Link>
              <Link to="/nosotros"><Button variant="secondary">Conócenos</Button></Link>
            </div>
          </div>
          <div className="orbit-enter orbit-enter-4 hidden md:flex justify-center">
            <StatusPanel />
          </div>
        </div>
        <ScrollCue />
      </section>

      <section className="py-14 border-y border-white/10">
        <TechOrbit />
      </section>

      <section ref={mission.ref} className={`${mission.className} max-w-6xl mx-auto px-8 py-16`}>
        <div className="relative grid gap-0 rounded-2xl border border-white/10 overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          <div className="p-10 bg-white/[0.04] relative">
            <div className="orbit-radar w-12 h-12 rounded-full border border-orbix-violet/40 bg-orbix-violet/10 grid place-items-center mb-5 text-orbix-violet">
              <span className="w-2.5 h-2.5 rounded-full bg-orbix-violet" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-orbix-violet">01 · Misión</span>
            <p className="text-slate leading-relaxed mt-3">Diseñar y construir soluciones de software que resuelven problemas reales, aplicando en cada proyecto académico los estándares de calidad de la industria.</p>
          </div>
          <div className="p-10 bg-white/[0.02] relative border-t md:border-t-0 md:border-l border-white/10">
            <div className="orbit-radar w-12 h-12 rounded-full border border-orbix-lime/40 bg-orbix-lime/10 grid place-items-center mb-5 text-orbix-lime">
              <span className="w-2.5 h-2.5 rounded-full bg-orbix-lime" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-orbix-lime">02 · Visión</span>
            <p className="text-slate leading-relaxed mt-3">Ser un equipo referente dentro de la universidad por la calidad técnica y el impacto de nuestros proyectos de desarrollo de software.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-orbix-violet/5">
        <div className="max-w-6xl mx-auto px-8 py-14 grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {stats.map((s) => (
            <StatCard key={s.label} num={s.num} label={s.label} icon={s.icon} />
          ))}
        </div>
      </section>

      <section ref={cases.ref} className={`${cases.className} orbit-starfield max-w-6xl mx-auto px-8 py-16`}>
        <span className="text-sm font-semibold tracking-widest text-orbix-violet uppercase">Casos de estudio</span>
        <h2 className="font-display font-bold text-4xl mt-3 mb-9">Proyectos que ya construimos.</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          {caseStudies.map((c) => (
            <div key={c.title} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orbix-violet/40 to-orbix-lime/15" />
              <div className="p-6">
                <span className="text-xs font-semibold text-orbix-lime bg-orbix-lime/10 rounded-full px-2.5 py-1">{c.tag}</span>
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
            <span className="text-sm font-semibold tracking-widest text-orbix-violet uppercase">Blog</span>
            <h2 className="font-display font-bold text-4xl mt-3">Últimos posts</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-orbix-lime border border-orbix-lime/30 rounded-xl px-5 py-3 font-display font-semibold text-sm">
            Ver todos los posts
          </Link>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
          {posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="block bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              {p.coverImageUrl ? (
                <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.coverImageUrl})` }} />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-orbix-violet/40 to-orbix-lime/15" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xs font-semibold text-orbix-lime bg-orbix-lime/10 rounded-full px-2.5 py-1">{p.tags[0]}</span>
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
        <div className="orbit-mesh-bg rounded-3xl p-14 bg-navy border border-white/10">
          <h2 className="font-display font-bold text-4xl mb-3 max-w-md">¿Tienes un proyecto en mente? Hablemos.</h2>
          <p className="text-slate mb-7 max-w-xl">Cuéntanos qué quieres construir y te respondemos con una propuesta técnica.</p>
          <Link to="/contacto">
            <Button variant="primary">Ir a contacto</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
