import { Link } from 'react-router-dom';
import type { Post } from '../../firebase/posts';
import { formatDate } from '../../utils/date';
import { tagColor, readingTime } from '../../utils/tagColor';

export function PostCard({ post }: { post: Post }) {
  const color = tagColor(post.tags[0]);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-orbix-lime/40"
      style={{ borderTop: `2px solid ${color}` }}
    >
      {post.coverImageUrl ? (
        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImageUrl})` }} />
      ) : (
        <div className="aspect-video bg-gradient-to-br from-orbix-violet/40 to-orbix-lime/15" />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ color, backgroundColor: `${color}1a` }}>{post.tags[0]}</span>
          <span className="text-xs text-slate">{formatDate(post.createdAt)}</span>
          <span className="text-xs text-slate">· {readingTime(post.content)} min</span>
        </div>
        <h3 className="font-display font-semibold text-lg mb-2.5">{post.title}</h3>
        <p className="text-sm text-slate mb-4">{post.summary}</p>
        <div className="flex items-center gap-2.5">
          {post.authorPhotoUrl ? (
            <img
              src={post.authorPhotoUrl}
              alt={post.authorName}
              className="w-7 h-7 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orbix-violet to-orbix-lime flex-shrink-0" />
          )}
          <span className="text-sm text-slate">{post.authorName}</span>
        </div>
      </div>
    </Link>
  );
}
