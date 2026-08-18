import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, getPublishedPosts } from '../firebase/posts';
import type { Post } from '../firebase/posts';
import { formatDate } from '../utils/date';
import { tagColor, readingTime } from '../utils/tagColor';
import { parsePostContent } from '../utils/parsePostContent';
import { TableOfContentsSidebar, TableOfContentsModal } from '../components/blog/TableOfContents';
import { PostCard } from '../components/blog/PostCard';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    getPublishedPosts().then((all) => {
      setRelated(
        all.filter((p) => p.id !== post.id && p.tags[0] === post.tags[0]).slice(0, 3),
      );
    });
  }, [post]);

  const { html: contentHtml, sections } = useMemo(
    () => parsePostContent(post?.content ?? ''),
    [post?.content],
  );

  if (post === undefined) return null;
  if (post === null) return <p className="p-10 text-center text-slate">Post no encontrado.</p>;

  const color = tagColor(post.tags[0]);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-8 py-14 flex gap-12">
        <TableOfContentsSidebar sections={sections} />

        <div className="max-w-3xl w-full">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-orbix-lime text-sm font-semibold mb-6">
            ← Volver al blog
          </Link>
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold rounded-full px-3 py-1.5" style={{ color, backgroundColor: `${color}1a` }}>{post.tags[0]}</span>
            <span className="text-sm text-slate">{formatDate(post.createdAt)}</span>
            <span className="text-sm text-slate">· {readingTime(post.content)} min de lectura</span>
          </div>
          <h1 className="font-display font-bold text-5xl leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center gap-3 pb-7 mb-8 border-b border-white/10">
            {post.authorPhotoUrl ? (
              <img
                src={post.authorPhotoUrl}
                alt={post.authorName}
                className="w-11 h-11 rounded-full object-cover border border-white/15"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orbix-violet to-orbix-lime flex-shrink-0" />
            )}
            <div>
              <div className="font-semibold text-bone">{post.authorName}</div>
              <div className="text-sm text-slate">ORBIX Studio</div>
            </div>
          </div>

          {/* Imagen de portada contenida dentro del artículo */}
          {post.coverImageUrl ? (
            <div
              className="rounded-2xl overflow-hidden mb-10 border border-white/10 bg-cover bg-center w-full"
              style={{ backgroundImage: `url(${post.coverImageUrl})`, aspectRatio: '16/7', maxHeight: '400px' }}
            />
          ) : (
            <div className="rounded-2xl mb-10 bg-gradient-to-br from-orbix-violet/50 to-orbix-lime/20" style={{ aspectRatio: '16/7', maxHeight: '400px' }} />
          )}

          <div
            className="text-[17.5px] leading-8 text-[#c9cfda]
              [&_h2]:relative [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-bone [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:pt-4 [&_h2]:scroll-mt-24
              [&_h2::before]:content-[''] [&_h2::before]:absolute [&_h2::before]:top-0 [&_h2::before]:left-0 [&_h2::before]:w-10 [&_h2::before]:h-[3px] [&_h2::before]:rounded-full [&_h2::before]:bg-gradient-to-r [&_h2::before]:from-orbix-violet [&_h2::before]:to-orbix-lime
              [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:text-bone [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-6
              [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-6 [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:mb-2.5
              [&_ul>li::before]:content-[''] [&_ul>li::before]:absolute [&_ul>li::before]:left-0 [&_ul>li::before]:top-3 [&_ul>li::before]:w-1.5 [&_ul>li::before]:h-1.5 [&_ul>li::before]:rounded-full [&_ul>li::before]:bg-orbix-lime
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2.5 [&_ol]:marker:text-orbix-lime
              [&_blockquote]:border-l-4 [&_blockquote]:border-orbix-violet [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:my-8
              [&_code]:bg-white/10 [&_code]:text-orbix-lime [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[15px]
              [&_pre]:bg-black/70 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-2xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:text-sm [&_pre]:leading-6
              [&_pre_code]:bg-transparent [&_pre_code]:text-[#c9cfda] [&_pre_code]:px-0 [&_pre_code]:py-0
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:text-sm
              [&_th]:text-left [&_th]:font-mono [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-orbix-lime [&_th]:border-b [&_th]:border-white/15 [&_th]:px-4 [&_th]:py-3
              [&_td]:border-b [&_td]:border-white/5 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top
              [&_tbody_tr:nth-child(even)]:bg-white/[0.02]
              [&_img]:rounded-2xl [&_img]:my-8 [&_img]:max-w-full [&_img]:border [&_img]:border-white/10
              [&_hr]:border-none [&_hr]:h-8
              [&_a]:text-orbix-lime [&_a]:underline [&_a]:underline-offset-2
              [&_[data-youtube-video]]:aspect-video [&_[data-youtube-video]]:rounded-2xl [&_[data-youtube-video]]:overflow-hidden [&_[data-youtube-video]]:my-8 [&_[data-youtube-video]]:border [&_[data-youtube-video]]:border-white/10
              [&_[data-youtube-video]_iframe]:w-full [&_[data-youtube-video]_iframe]:h-full"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          <div className="flex gap-2.5 flex-wrap mt-9">
            {post.tags.map((t) => (
              <span key={t} className="text-sm text-slate border border-white/15 rounded-full px-3.5 py-1.5">#{t}</span>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/10">
              <h2 className="font-display font-bold text-2xl mb-6">Posts relacionados</h2>
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                {related.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 border border-orbix-lime/30 text-orbix-lime rounded-xl px-6 py-3.5 font-display font-semibold text-sm">
              ← Volver al blog
            </Link>
          </div>
        </div>
      </div>

      <TableOfContentsModal sections={sections} />
    </div>
  );
}
