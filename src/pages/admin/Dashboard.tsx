import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost } from '../../firebase/posts';
import type { Post } from '../../firebase/posts';
import { useAuth } from '../../firebase/auth';
import { formatDate } from '../../utils/date';
import { tagColor } from '../../utils/tagColor';
import { Logo } from '../../components/layout/Logo';

export function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.length - published;

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center gap-4 px-7 py-4 bg-navy/85 border-b border-white/10">
        <Logo variant="icon" />
        <span className="font-display font-semibold text-sm text-slate">Panel de administración</span>
        <button
          onClick={async () => { await signOut(); navigate('/admin/login'); }}
          className="ml-auto border border-white/15 text-slate rounded-lg px-4 py-2 text-sm hover:text-orbix-lime hover:border-orbix-lime/40"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-7 py-11">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-2">Publicaciones</h1>
            <div className="flex items-center gap-3 text-sm text-slate">
              <span>{posts.length} artículos</span>
              <span className="text-white/15">·</span>
              <span className="text-orbix-lime">{published} publicados</span>
              <span className="text-white/15">·</span>
              <span>{drafts} borradores</span>
            </div>
          </div>
          <Link to="/admin/editor" className="bg-orbix-violet text-bone rounded-xl px-5 py-3 font-display font-semibold text-sm hover:bg-orbix-lime hover:text-navy">
            + Nuevo post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl py-20 text-center text-slate">
            Todavía no hay posts. Creá el primero.
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
            {posts.map((p) => {
              const color = tagColor(p.tags[0]);
              return (
                <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group">
                  {p.coverImageUrl ? (
                    <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.coverImageUrl})` }} />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-orbix-violet/30 to-orbix-lime/10 grid place-items-center text-xs text-slate font-mono uppercase tracking-widest">
                      Sin portada
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {p.tags[0] && (
                        <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ color, backgroundColor: `${color}1a` }}>{p.tags[0]}</span>
                      )}
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        p.status === 'published' ? 'bg-orbix-lime/15 text-orbix-lime' : 'bg-slate/15 text-slate'
                      }`}>
                        {p.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1.5 line-clamp-2">{p.title || 'Sin título'}</h3>
                    <p className="text-xs text-slate">{formatDate(p.createdAt)} · {p.authorName}</p>
                    <div className="flex gap-2 mt-4">
                      <Link to={`/admin/editor/${p.id}`} className="flex-1 text-center border border-white/15 rounded-lg py-2 text-sm text-slate hover:text-orbix-lime hover:border-orbix-lime/40">
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(p.id)} aria-label="Eliminar" className="w-9 h-9 grid place-items-center border border-white/15 rounded-lg text-slate hover:text-red-400 hover:border-red-400/40">
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
