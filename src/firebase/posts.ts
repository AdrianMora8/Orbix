import {
  collection, query, where, orderBy, getDocs, doc, getDoc,
  addDoc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { slugify } from '../utils/slug';

export type PostStatus = 'draft' | 'published';

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  tags: string[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
};

const POSTS = 'posts';

function toPost(id: string, data: any): Post {
  return {
    id,
    slug: data.slug,
    title: data.title,
    summary: data.summary ?? '',
    content: data.content ?? '',
    coverImageUrl: data.coverImageUrl ?? '',
    authorId: data.authorId ?? '',
    authorName: data.authorName ?? '',
    authorPhotoUrl: data.authorPhotoUrl ?? '',
    tags: data.tags ?? [],
    status: data.status,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
  };
}

export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(
    collection(db, POSTS),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getAllPosts(): Promise<Post[]> {
  const q = query(collection(db, POSTS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, POSTS),
    where('slug', '==', slug),
    where('status', '==', 'published'),
  );
  const snap = await getDocs(q);
  if (snap.docs.length === 0) return null;
  return toPost(snap.docs[0].id, snap.docs[0].data());
}

export type PostInput = {
  title: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  tags: string[];
  status: PostStatus;
};

export async function createPost(input: PostInput): Promise<string> {
  const ref = await addDoc(collection(db, POSTS), {
    ...input,
    slug: slugify(input.title),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  await updateDoc(doc(db, POSTS, id), {
    ...input,
    slug: slugify(input.title),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, POSTS, id));
}

export async function getPostById(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, POSTS, id));
  if (!snap.exists()) return null;
  return toPost(snap.id, snap.data());
}
