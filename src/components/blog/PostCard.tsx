import { Link } from 'react-router-dom';
import { Post } from '../../firebase/posts';
import { formatDate } from '../../utils/date';

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-orbix-cyan/40">
      <div className="aspect-video bg-gradient-to-br from-orbix-blue/40 to-orbix-cyan/15" />
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">{post.tags[0]}</span>
          <span className="text-xs text-slate">{formatDate(post.createdAt)}</span>
        </div>
        <h3 className="font-display font-semibold text-lg mb-2.5">{post.title}</h3>
        <p className="text-sm text-slate mb-4">{post.summary}</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orbix-blue to-orbix-cyan" />
          <span className="text-sm text-slate">{post.authorName}</span>
        </div>
      </div>
    </Link>
  );
}
