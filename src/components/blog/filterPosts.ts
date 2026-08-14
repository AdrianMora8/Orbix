import { Post } from '../../firebase/posts';

export function filterPosts(posts: Post[], { tag, query }: { tag: string; query: string }): Post[] {
  const q = query.trim().toLowerCase();
  return posts.filter((p) => {
    const matchesTag = tag === 'Todos' || p.tags.includes(tag);
    const matchesQuery = q === '' || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });
}
