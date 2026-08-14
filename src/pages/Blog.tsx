import { useEffect, useState } from 'react';
import { getPublishedPosts } from '../firebase/posts';
import type { Post } from '../firebase/posts';
import { filterPosts } from '../components/blog/filterPosts';
import { PostCard } from '../components/blog/PostCard';

const TAGS = ['Todos', 'Arquitectura', 'DevOps', 'Backend', 'Frontend', 'Calidad', 'Datos'];

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState('Todos');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getPublishedPosts().then(setPosts);
  }, []);

  const visible = filterPosts(posts, { tag, query });

  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-violet uppercase">Blog</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4">Notas de ingeniería</h1>
          <p className="text-lg text-slate max-w-2xl">Lo que aprendemos construyendo software real: arquitectura, prácticas, herramientas y decisiones técnicas del equipo.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 pt-9 pb-5">
        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artículos…"
            className="flex-1 bg-transparent outline-none text-bone text-sm"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-2 flex gap-2.5 flex-wrap">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium border ${
              tag === t ? 'bg-orbix-violet border-orbix-violet text-bone' : 'bg-transparent border-white/15 text-slate'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {visible.map((p) => <PostCard key={p.id} post={p} />)}
        {visible.length > 0 && visible.length < 3 &&
          Array.from({ length: 3 - visible.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className="rounded-2xl border border-dashed border-white/10 grid place-items-center min-h-[280px] text-center px-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate">Próximamente</span>
                <p className="text-sm text-slate mt-2">Nuevo artículo en camino.</p>
              </div>
            </div>
          ))
        }
      </div>
      {visible.length === 0 && (
        <div className="max-w-6xl mx-auto px-8 py-8">
          <p className="text-slate text-center py-16 border border-dashed border-white/10 rounded-2xl">No hay artículos que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
}
