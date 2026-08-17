import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import { getMemberByUid, saveMember } from '../../firebase/members';
import type { Discipline } from '../../firebase/members';
import { Logo } from '../../components/layout/Logo';
import { uploadCoverImage } from '../../utils/cloudinary';

const DISCIPLINES: Discipline[] = ['Frontend', 'Backend', 'Full-Stack', 'Diseño', 'DevOps', 'QA', 'Otro'];

export function Perfil() {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [orbit, setOrbit] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('Otro');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [order, setOrder] = useState(99);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMemberByUid(user.uid).then((m) => {
      if (m) {
        setName(m.name);
        setRole(m.role);
        setOrbit(m.orbit);
        setDiscipline(m.discipline);
        setGithub(m.github);
        setLinkedin(m.linkedin);
        setPhotoUrl(m.photoUrl);
        setOrder(m.order);
      } else {
        // Prefill name from Firebase Auth
        setName(user.displayName ?? '');
      }
      setLoaded(true);
    });
  }, [user]);

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadCoverImage(file, `orbix-team/${user!.uid}`);
      setPhotoUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo subir la foto.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await saveMember(user.uid, { name, role, orbit, discipline, github, linkedin, photoUrl, order });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="text-slate text-sm">Cargando perfil…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="flex items-center gap-4 px-7 py-4 bg-navy/85 border-b border-white/10">
        <Logo variant="icon" />
        <span className="font-display font-semibold text-sm text-slate">Mi perfil</span>
        <Link to="/admin" className="ml-auto text-slate hover:text-orbix-lime text-sm">
          ← Volver al panel
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-7 py-10">
        <div className="flex items-center gap-4 mb-8">
          {/* Avatar preview */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-2 border-orbix-violet/40"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orbix-violet to-orbix-lime flex-shrink-0" />
          )}
          <div>
            <h1 className="font-display font-bold text-2xl">{name || 'Tu perfil'}</h1>
            <p className="text-sm text-slate mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">

          {/* Foto de perfil */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
              className="text-sm text-slate mb-1"
            />
            {uploading && <p className="text-xs text-orbix-lime mt-1">Subiendo foto…</p>}
            <p className="text-xs text-slate/60 mt-1">O pega una URL directamente:</p>
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-bone text-sm mt-1.5"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Nombre completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Alan Puruncajas"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Rol en el equipo</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="Ej: Backend Lead"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone"
            />
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Disciplina</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as Discipline)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d} className="bg-navy">{d}</option>
              ))}
            </select>
          </div>

          {/* Área de especialización */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Área de especialización</label>
            <input
              value={orbit}
              onChange={(e) => setOrbit(e.target.value)}
              placeholder="Ej: Sistemas distribuidos"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-orbix-lime"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A10.5 10.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>
                GitHub
              </span>
            </label>
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/tu-usuario"
              type="url"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-orbix-lime"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>
                LinkedIn
              </span>
            </label>
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/tu-usuario"
              type="url"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm"
            />
          </div>

          {/* Orden de aparición */}
          <div>
            <label className="block text-sm font-semibold text-slate mb-2">Orden de aparición (1 = primero)</label>
            <input
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              type="number"
              min={1}
              max={99}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-orbix-violet text-bone rounded-xl px-6 py-3.5 font-display font-semibold text-sm hover:bg-orbix-lime hover:text-navy disabled:opacity-50 mt-2"
          >
            {saving ? 'Guardando…' : 'Guardar perfil'}
          </button>

          {saved && (
            <p className="text-center text-orbix-lime text-sm font-semibold">
              ✓ Perfil guardado — los cambios se reflejarán en la página Nosotros
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
