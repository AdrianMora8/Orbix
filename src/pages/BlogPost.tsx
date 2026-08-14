import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../firebase/posts';
import type { Post } from '../firebase/posts';
import { formatDate } from '../utils/date';
import { tagColor, readingTime } from '../utils/tagColor';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  if (post === undefined) return null;
  if (post === null) return <p className="p-10 text-center text-slate">Post no encontrado.</p>;

  const color = tagColor(post.tags[0]);

  return (
    <div>
      {post.coverImageUrl ? (
        <div className="aspect-[21/8] min-h-[220px] bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImageUrl})` }} />
      ) : (
        <div className="aspect-[21/8] min-h-[220px] bg-gradient-to-br from-orbix-blue/50 to-orbix-cyan/20" />
      )}
      <div className="max-w-3xl mx-auto px-8 py-14">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-orbix-cyan text-sm font-semibold mb-6">
          ← Volver al blog
        </Link>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xs font-semibold rounded-full px-3 py-1.5" style={{ color, backgroundColor: `${color}1a` }}>{post.tags[0]}</span>
          <span className="text-sm text-slate">{formatDate(post.createdAt)}</span>
          <span className="text-sm text-slate">· {readingTime(post.content)} min de lectura</span>
        </div>
        <h1 className="font-display font-bold text-5xl leading-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-3 pb-7 mb-8 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orbix-blue to-orbix-cyan" />
          <div>
            <div className="font-semibold text-bone">{post.authorName}</div>
            <div className="text-sm text-slate">ORBIX Studio</div>
          </div>
        </div>
        <div
          className="text-[17.5px] leading-8 text-[#c9cfda] [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-bone [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-orbix-blue [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:text-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="flex gap-2.5 flex-wrap mt-9">
          {post.tags.map((t) => (
            <span key={t} className="text-sm text-slate border border-white/15 rounded-full px-3.5 py-1.5">#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
