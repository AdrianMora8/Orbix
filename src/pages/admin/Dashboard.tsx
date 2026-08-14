import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost } from '../../firebase/posts';
import type { Post } from '../../firebase/posts';
import { useAuth } from '../../firebase/auth';
import { formatDate } from '../../utils/date';

export function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  async function handleDelete(id: string) {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-4 px-7 py-4 bg-navy/85 border-b border-white/10">
        <span className="font-display font-semibold text-sm text-slate">Admin</span>
        <button
          onClick={async () => { await signOut(); navigate('/admin/login'); }}
          className="ml-auto border border-white/15 text-slate rounded-lg px-4 py-2 text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-7 py-11">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1.5">Mis posts</h1>
            <p className="text-sm text-slate">{posts.length} artículos</p>
          </div>
          <Link to="/admin/editor" className="bg-orbix-violet text-bone rounded-xl px-5 py-3 font-display font-semibold text-sm">
            + Nuevo post
          </Link>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {posts.map((p) => (
            <div key={p.id} className="grid items-center gap-4 px-6 py-4 border-b border-white/5" style={{ gridTemplateColumns: '1fr 130px 120px 110px' }}>
              <div className="font-display font-semibold text-bone">{p.title}</div>
              <div className="text-sm text-slate">{formatDate(p.createdAt)}</div>
              <div>
                <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                  p.status === 'published' ? 'bg-orbix-lime/15 text-orbix-lime' : 'bg-slate/15 text-slate'
                }`}>
                  {p.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <div className="flex gap-2 justify-end">
                <Link to={`/admin/editor/${p.id}`} aria-label="Editar" className="w-8 h-8 grid place-items-center border border-white/15 rounded-lg text-slate">✎</Link>
                <button onClick={() => handleDelete(p.id)} aria-label="Eliminar" className="w-8 h-8 grid place-items-center border border-white/15 rounded-lg text-slate">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
