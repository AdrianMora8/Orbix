import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, getPostById } from '../../firebase/posts';
import { useAuth } from '../../firebase/auth';
import { uploadCoverImage } from '../../utils/cloudinary';
import { slugify } from '../../utils/slug';
import { EditorToolbar } from './EditorToolbar';

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ nocookie: true }),
    ],
    content: '',
  });

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

  function postFolder() {
    const base = title.trim() ? slugify(title) : `borrador-${id ?? Date.now()}`;
    return `orbix-posts/${base}`;
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadCoverImage(file, postFolder());
      setCoverImageUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo subir la imagen de portada.');
    } finally {
      setUploading(false);
    }
  }

  const [insertingImage, setInsertingImage] = useState(false);

  async function handleContentImageUpload(file: File) {
    setInsertingImage(true);
    try {
      const url = await uploadCoverImage(file, postFolder());
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setInsertingImage(false);
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
        <Link to="/admin" className="text-slate hover:text-orbix-lime text-sm">← Volver</Link>
        <span className="font-display font-semibold text-sm">{id ? 'Editar post' : 'Nuevo post'}</span>
        <div className="ml-auto flex gap-2.5">
          <button onClick={() => save('draft')} className="border border-white/15 text-bone rounded-lg px-4.5 py-2.5 font-display font-semibold text-sm hover:border-orbix-lime/40 hover:text-orbix-lime">
            Guardar borrador
          </button>
          <button onClick={() => save('published')} className="bg-orbix-violet text-bone rounded-lg px-4.5 py-2.5 font-display font-semibold text-sm hover:bg-orbix-lime hover:text-navy">
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
        <p className="text-xs text-slate mb-2">
          Escribí libremente como en un documento: seguí tipeando, presioná Enter para bajar de línea y usá los
          botones de arriba para convertir el bloque donde está el cursor (título, lista, tabla, etc.). Podés mezclar
          todos los que quieras, en el orden que quieras.
        </p>
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => {
              const html = window.prompt('Pegá el HTML del contenido:');
              if (html) editor?.commands.setContent(html, { emitUpdate: true });
            }}
            className="text-xs text-slate hover:text-orbix-lime border border-white/10 rounded-lg px-3 py-1.5"
          >
            Importar HTML
          </button>
        </div>
        <EditorToolbar editor={editor} onUploadImage={handleContentImageUpload} />
        {insertingImage && <p className="text-xs text-orbix-lime mb-2">Subiendo imagen…</p>}
        <div className="border border-white/10 rounded-b-xl overflow-hidden mb-6">
          <EditorContent
            editor={editor}
            className="min-h-[220px] px-4 pt-4 text-[#c9cfda] max-w-none
              [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-bone [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:text-bone [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-orbix-violet [&_blockquote]:pl-4 [&_blockquote]:italic
              [&_code]:bg-white/10 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm
              [&_pre]:bg-black/60 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent
              [&_table]:border-collapse [&_table]:w-full [&_th]:border [&_th]:border-white/15 [&_th]:p-2 [&_td]:border [&_td]:border-white/15 [&_td]:p-2
              [&_img]:rounded-lg [&_img]:max-w-full"
          />
          <div
            className="h-16 px-4 py-2 text-xs text-slate/60 cursor-text"
            onClick={() => {
              const lastNode = editor?.state.doc.lastChild;
              if (lastNode && lastNode.type.name !== 'paragraph') {
                editor?.chain().focus('end').insertContent({ type: 'paragraph' }).run();
              } else {
                editor?.chain().focus('end').run();
              }
            }}
          >
            ↓ Hacé clic acá para seguir escribiendo al final
          </div>
        </div>

        <label htmlFor="tagInput" className="block text-sm font-semibold text-slate mb-2.5">Agregar tag</label>
        <input id="tagInput" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-bone text-sm mb-3" />
        <div className="flex gap-2 flex-wrap">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-sm text-orbix-lime bg-orbix-lime/10 border border-orbix-lime/30 rounded-full px-3.5 py-1.5">
              {t}
              <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="opacity-70">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
