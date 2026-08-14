import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, getPostById } from '../../firebase/posts';
import { useAuth } from '../../firebase/auth';
import { uploadCoverImage } from '../../utils/cloudinary';

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const editor = useEditor({ extensions: [StarterKit], content: '' });

  useEffect(() => {
    if (!id) return;
    getPostById(id).then((post) => {
      if (!post) return;
      setTitle(post.title);
      setSummary(post.summary);
      setCoverImageUrl(post.coverImageUrl);
      setTags(post.tags);
      editor?.commands.setContent(post.content);
    });
  }, [id, editor]);

  const [uploading, setUploading] = useState(false);

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  async function save(status: 'draft' | 'published') {
    const payload = {
      title,
      summary,
      content: editor?.getHTML() ?? '',
      coverImageUrl,
      authorId: user!.uid,
      authorName: user!.displayName ?? user!.email ?? 'Miembro ORBIX',
      tags,
      status,
    };
    if (id) {
      await updatePost(id, payload);
    } else {
      await createPost(payload);
    }
    navigate('/admin');
  }

  return (
    <div>
      <div className="flex items-center gap-4 px-7 py-4 bg-navy/85 border-b border-white/10">
        <span className="font-display font-semibold text-sm">{id ? 'Editar post' : 'Nuevo post'}</span>
        <div className="ml-auto flex gap-2.5">
          <button onClick={() => save('draft')} className="border border-white/15 text-bone rounded-lg px-4.5 py-2.5 font-display font-semibold text-sm">
            Guardar borrador
          </button>
          <button onClick={() => save('published')} className="bg-orbix-blue text-bone rounded-lg px-4.5 py-2.5 font-display font-semibold text-sm">
            Publicar
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-7 py-10">
        <label htmlFor="title" className="block text-sm font-semibold text-slate mb-2">Título</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-bone font-display font-semibold text-xl mb-6" />

        <label htmlFor="summary" className="block text-sm font-semibold text-slate mb-2">Resumen</label>
        <textarea id="summary" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone mb-6" />

        <label htmlFor="cover" className="block text-sm font-semibold text-slate mb-2">Imagen de portada</label>
        <input id="cover" type="file" accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          className="mb-2 text-sm text-slate" />
        {uploading && <p className="text-sm text-slate mb-4">Subiendo imagen…</p>}
        {coverImageUrl && !uploading && (
          <img src={coverImageUrl} alt="Portada" className="w-full max-h-52 object-cover rounded-xl mb-6" />
        )}

        <label className="block text-sm font-semibold text-slate mb-2">Contenido</label>
        <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
          <EditorContent editor={editor} className="min-h-[220px] px-4 py-4 text-[#c9cfda] prose prose-invert max-w-none" />
        </div>

        <label htmlFor="tagInput" className="block text-sm font-semibold text-slate mb-2.5">Agregar tag</label>
        <input id="tagInput" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-bone text-sm mb-3" />
        <div className="flex gap-2 flex-wrap">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-sm text-orbix-cyan bg-orbix-cyan/10 border border-orbix-cyan/30 rounded-full px-3.5 py-1.5">
              {t}
              <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="opacity-70">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
