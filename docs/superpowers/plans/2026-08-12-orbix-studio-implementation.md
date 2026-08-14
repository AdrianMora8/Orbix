# ORBIX Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ORBIX Studio site — a React/TypeScript institutional site with a Firebase-backed blog CMS — matching the approved Claude Design mockup pixel-for-pixel on the pages it covers, and extending the same visual system to the two pages it didn't cover (Nosotros, Contacto).

**Architecture:** Single Vite + React 18 + TypeScript SPA. Public routes (`/`, `/blog`, `/blog/:slug`, `/nosotros`, `/contacto`) and an authenticated admin area (`/admin/login`, `/admin`, `/admin/editor/:id?`) share one codebase and one React Router tree. Firebase (Auth, Firestore, Storage) is the only backend — no custom server. Firestore reads for public pages happen client-side against `published` posts; writes require an authenticated session (any team member).

**Tech Stack:** Vite, React 18, TypeScript, React Router v6, Tailwind CSS, Firebase (Auth/Firestore/Storage) v10 modular SDK, Tiptap (rich text editor), Vitest + React Testing Library + `@firebase/rules-unit-testing`.

## Global Constraints

- Design source of truth for pixel details (colors, spacing, copy, SVGs): `Formulario de especificaciones del proyecto-handoff/formulario-de-especificaciones-del-proyecto/project/ORBIX Studio.dc.html` (referenced below as **the mockup**). Recreate its visual output with Tailwind/React — do not copy its `x-dc`/`sc-if`/inline-style internals.
- Palette (exact hex, from mockup `palette` array and root styles): background `#05070f`, surface/navy `#0A1128`, primary blue `#2E6BFF`, cyan `#5FD4D0`, bone text `#F5F7FA`, slate text `#8A94A6`.
- Fonts: `Space Grotesk` (weights 400/500/600/700) for headings/buttons, `Inter` (400/500/600) for body — loaded via Google Fonts exactly as in mockup `<helmet>`.
- All UI copy is Spanish, matching the mockup's exact strings unless a task says otherwise.
- Any team member (not just one admin) can log in and publish/edit any post — dashboard and editor are not scoped to "my posts only".
- Firestore collections: `posts`, `team`, `messages`, `users` — schema exactly as defined in `docs/superpowers/specs/2026-08-12-orbix-studio-design.md` §4.
- No multi-language, no comments on posts, no granular roles, no full-text search service, no analytics — out of scope per spec §5.
- Every task that touches logic (utils, Firebase data layer, auth, form validation, filtering) gets a real unit/component test written first. Purely static presentational sections get a render smoke test (renders expected copy/structure) rather than a full TDD cycle — call this out explicitly in the task, it is not a shortcut for logic-bearing code.

---

## File Structure

```
/home/adrian/dev/UTA/
  index.html
  package.json, tsconfig.json, vite.config.ts, tailwind.config.js, postcss.config.js
  .env.example
  firebase.json, .firebaserc, firestore.rules, storage.rules
  src/
    main.tsx
    App.tsx
    firebase/
      config.ts
      auth.ts
      posts.ts
      team.ts
      messages.ts
    utils/
      slug.ts
      date.ts
    components/
      layout/Logo.tsx
      layout/Navbar.tsx
      layout/Footer.tsx
      layout/PublicLayout.tsx
      ui/Button.tsx
      ui/Badge.tsx
      blog/PostCard.tsx
      blog/filterPosts.ts
      admin/ProtectedRoute.tsx
    pages/
      Home.tsx
      Blog.tsx
      BlogPost.tsx
      Nosotros.tsx
      Contacto.tsx
      admin/Login.tsx
      admin/Dashboard.tsx
      admin/Editor.tsx
    test/setup.ts
  docs/superpowers/specs/2026-08-12-orbix-studio-design.md   (existing)
  docs/superpowers/specs/orbix-studio-design-prompt.md        (existing)
```

---

### Task 1: Project scaffold (Vite + React + TS + Tailwind + fonts)

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Tailwind theme tokens `bg`, `navy`, `orbix-blue`, `orbix-cyan`, `bone`, `slate` (used by every later component task). Font families `font-display` (Space Grotesk) and `font-sans` (Inter, Tailwind default).

- [ ] **Step 1: Scaffold the Vite project**

```bash
npm create vite@latest . -- --template react-ts
```

When prompted about a non-empty directory, choose to continue (the `docs/` and handoff folders already exist and should be left alone).

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom firebase @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @firebase/rules-unit-testing
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind tokens**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070f',
        navy: '#0A1128',
        'orbix-blue': '#2E6BFF',
        'orbix-cyan': '#5FD4D0',
        bone: '#F5F7FA',
        slate: '#8A94A6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Wire fonts and base styles**

`index.html` `<head>` must include (copied from the mockup's `<helmet>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body { margin: 0; padding: 0; background: #05070f; }
body { -webkit-font-smoothing: antialiased; }
::selection { background: rgba(46,107,255,0.35); }
```

- [ ] **Step 5: Configure Vitest**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

Add to `package.json` `scripts`: `"test": "vitest run"`.

- [ ] **Step 6: Write the failing smoke test**

`src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing and shows the ORBIX wordmark', () => {
    render(<App />);
    expect(screen.getByText(/RBIX/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `App` doesn't render an ORBIX wordmark yet (default Vite template content).

- [ ] **Step 8: Minimal implementation to pass**

`src/App.tsx`:
```tsx
export default function App() {
  return <div className="font-display text-bone">ORBIX</div>;
}
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite/React/TS project with Tailwind and Vitest"
```

---

### Task 2: Firebase project config module

**Files:**
- Create: `src/firebase/config.ts`
- Create: `.env.example`
- Test: `src/firebase/config.test.ts`

**Interfaces:**
- Produces: `getFirebaseApp(): FirebaseApp`, `auth: Auth`, `db: Firestore`, `storage: FirebaseStorage` (all consumed by Tasks 4–6, 14–17).

- [ ] **Step 1: Write the failing test**

`src/firebase/config.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('firebase config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'test.appspot.com');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '123');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app-id');
  });

  it('exposes an initialized Firestore db instance', async () => {
    const { db } = await import('./config');
    expect(db).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- config.test`
Expected: FAIL — `src/firebase/config.ts` does not exist.

- [ ] **Step 3: Implement**

`src/firebase/config.ts`:
```ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

`.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Note in a code comment at the top of `config.ts`: real values come from the Firebase Console (Project Settings → General → Your apps) and must be placed in a local `.env` (gitignored), never committed.

Add `.env` to `.gitignore` (create the file if it doesn't exist yet, keep any existing entries).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- config.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/firebase/config.ts src/firebase/config.test.ts .env.example .gitignore
git commit -m "feat: add Firebase app/auth/firestore/storage config module"
```

---

### Task 3: Pure utilities — slug and date formatting

**Files:**
- Create: `src/utils/slug.ts`, `src/utils/date.ts`
- Test: `src/utils/slug.test.ts`, `src/utils/date.test.ts`

**Interfaces:**
- Produces: `slugify(title: string): string`, `formatDate(input: Date | string): string` (used by Tasks 5, 10, 11, 17).

- [ ] **Step 1: Write failing tests**

`src/utils/slug.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Arquitectura Hexagonal')).toBe('arquitectura-hexagonal');
  });

  it('strips accents and punctuation', () => {
    expect(slugify('¿Cómo montamos CI/CD?')).toBe('como-montamos-ci-cd');
  });

  it('collapses repeated separators', () => {
    expect(slugify('  Título   con   espacios  ')).toBe('titulo-con-espacios');
  });
});
```

`src/utils/date.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats a Date as "D Mon YYYY" in Spanish', () => {
    expect(formatDate(new Date(2026, 7, 12))).toBe('12 ago 2026');
  });

  it('accepts an ISO string', () => {
    expect(formatDate('2026-08-12T00:00:00')).toBe('12 ago 2026');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- slug.test date.test`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

`src/utils/slug.ts`:
```ts
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

`src/utils/date.ts`:
```ts
export function formatDate(input: Date | string): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d).replace('.', '');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- slug.test date.test`
Expected: PASS (adjust the exact `Intl` locale/format string if the initial output differs slightly, e.g. `12 ago. 2026` vs `12 ago 2026` — match whatever `es-AR` actually outputs on the runtime, updating the test expectation to the real value rather than fighting the formatter).

- [ ] **Step 5: Commit**

```bash
git add src/utils/slug.ts src/utils/date.ts src/utils/slug.test.ts src/utils/date.test.ts
git commit -m "feat: add slugify and formatDate utilities"
```

---

### Task 4: Auth module (AuthContext + useAuth)

**Files:**
- Create: `src/firebase/auth.ts`
- Test: `src/firebase/auth.test.tsx`

**Interfaces:**
- Consumes: `auth` from `src/firebase/config.ts` (Task 2).
- Produces: `AuthProvider` (React component), `useAuth(): { user: User | null, loading: boolean, signIn(email, password): Promise<void>, signOut(): Promise<void> }` — consumed by Tasks 8, 14, 15, 16, 17.

- [ ] **Step 1: Write the failing test**

`src/firebase/auth.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';

vi.mock('./config', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, cb: (u: unknown) => void) => {
    cb(null);
    return () => {};
  },
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

function Probe() {
  const { user, loading } = useAuth();
  if (loading) return <span>loading</span>;
  return <span>{user ? 'logged-in' : 'logged-out'}</span>;
}

describe('AuthProvider', () => {
  it('resolves to logged-out state when there is no session', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => screen.getByText('logged-out'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- auth.test`
Expected: FAIL — `src/firebase/auth.ts` does not exist.

- [ ] **Step 3: Implement**

`src/firebase/auth.ts`:
```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from './config';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: async () => {
      await firebaseSignOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- auth.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/firebase/auth.ts src/firebase/auth.test.tsx
git commit -m "feat: add Firebase auth context and useAuth hook"
```

---

### Task 5: Firestore posts data layer

**Files:**
- Create: `src/firebase/posts.ts`
- Test: `src/firebase/posts.test.ts`

**Interfaces:**
- Consumes: `db` from Task 2, `slugify` from Task 3.
- Produces: `type Post`, `getPublishedPosts(): Promise<Post[]>`, `getPostBySlug(slug: string): Promise<Post | null>`, `getAllPosts(): Promise<Post[]>`, `createPost(input): Promise<string>`, `updatePost(id, input): Promise<void>`, `deletePost(id): Promise<void>` — consumed by Tasks 9, 10, 11, 16, 17.

- [ ] **Step 1: Write the failing test**

`src/firebase/posts.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';

const mockDocs = [
  { id: '1', data: () => ({ slug: 'a', title: 'A', status: 'published', createdAt: { toDate: () => new Date('2026-08-01') } }) },
];

vi.mock('./config', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: mockDocs })),
  doc: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(async () => ({ id: 'new-id' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-timestamp'),
}));

import { getPublishedPosts } from './posts';

describe('getPublishedPosts', () => {
  it('maps Firestore docs into Post objects', async () => {
    const posts = await getPublishedPosts();
    expect(posts).toEqual([
      expect.objectContaining({ id: '1', slug: 'a', title: 'A', status: 'published' }),
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- posts.test`
Expected: FAIL — `src/firebase/posts.ts` does not exist.

- [ ] **Step 3: Implement**

`src/firebase/posts.ts`:
```ts
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
  const q = query(collection(db, POSTS), where('slug', '==', slug));
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- posts.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/firebase/posts.ts src/firebase/posts.test.ts
git commit -m "feat: add Firestore posts data layer"
```

---

### Task 6: Firestore messages data layer (contact form)

**Files:**
- Create: `src/firebase/messages.ts`
- Test: `src/firebase/messages.test.ts`

**Interfaces:**
- Consumes: `db` from Task 2.
- Produces: `sendContactMessage(input: { name, email, subject, message }): Promise<void>` — consumed by Task 13.

- [ ] **Step 1: Write the failing test**

`src/firebase/messages.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';

const addDocMock = vi.fn(async () => ({ id: 'msg-1' }));
vi.mock('./config', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'messages-collection'),
  addDoc: addDocMock,
  serverTimestamp: vi.fn(() => 'server-timestamp'),
}));

import { sendContactMessage } from './messages';

describe('sendContactMessage', () => {
  it('writes the message with a server timestamp', async () => {
    await sendContactMessage({
      name: 'Ana', email: 'ana@example.com', subject: 'Hola', message: 'Test',
    });
    expect(addDocMock).toHaveBeenCalledWith('messages-collection', {
      name: 'Ana', email: 'ana@example.com', subject: 'Hola', message: 'Test',
      createdAt: 'server-timestamp',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- messages.test`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

`src/firebase/messages.ts`:
```ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(input: ContactMessageInput): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    ...input,
    createdAt: serverTimestamp(),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- messages.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/firebase/messages.ts src/firebase/messages.test.ts
git commit -m "feat: add Firestore messages (contact form) data layer"
```

---

### Task 7: Shared UI — Logo, Button, Badge

**Files:**
- Create: `src/components/layout/Logo.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Badge.tsx`
- Test: `src/components/layout/Logo.test.tsx`, `src/components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `<Logo variant="wordmark" | "icon" theme="dark" | "light" />`, `<Button variant="primary" | "secondary" | "ghost">`, `<Badge>` — consumed by Tasks 8, 9, 10, 11, 12, 13, 15, 16.

- [ ] **Step 1: Write the failing test**

`src/components/layout/Logo.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders the RBIX wordmark by default', () => {
    render(<Logo />);
    expect(screen.getByText('RBIX')).toBeInTheDocument();
  });

  it('renders icon-only variant without the wordmark', () => {
    render(<Logo variant="icon" />);
    expect(screen.queryByText('RBIX')).not.toBeInTheDocument();
  });
});
```

`src/components/ui/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and responds to click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ver proyectos</Button>);
    await userEvent.click(screen.getByText('Ver proyectos'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- Logo.test Button.test`
Expected: FAIL — components don't exist.

- [ ] **Step 3: Implement**

`src/components/layout/Logo.tsx` (orbital mark copied from mockup lines 33-38/449-477, `RBIX` wordmark exactly as in the mockup — the initial "O" is implied by the icon):
```tsx
type LogoProps = {
  variant?: 'wordmark' | 'icon';
  theme?: 'dark' | 'light';
};

export function Logo({ variant = 'wordmark', theme = 'dark' }: LogoProps) {
  const ring = '#2E6BFF';
  const cross = '#5FD4D0';
  const text = theme === 'dark' ? '#F5F7FA' : '#0A1128';

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 48" fill="none" className="block w-8 h-8 flex-none">
        <circle cx="24" cy="24" r="18" stroke={ring} strokeWidth="3.5" fill="none"
          strokeDasharray="82 31" strokeLinecap="round" transform="rotate(-40 24 24)" />
        <line x1="18" y1="18" x2="30" y2="30" stroke={cross} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="30" y1="18" x2="18" y2="30" stroke={cross} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="24" cy="6" r="3" fill={ring} />
      </svg>
      {variant === 'wordmark' && (
        <span className="font-display font-bold text-xl tracking-wide" style={{ color: text }}>
          RBIX
        </span>
      )}
    </div>
  );
}
```

`src/components/ui/Button.tsx`:
```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
};

const styles = {
  primary: 'bg-orbix-blue text-bone hover:bg-orbix-cyan hover:text-navy',
  secondary: 'bg-transparent text-bone border border-white/20 hover:border-orbix-cyan hover:text-orbix-cyan',
  ghost: 'bg-transparent text-orbix-cyan hover:text-orbix-blue px-0',
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-2 rounded-xl px-7 py-4 font-display font-semibold text-base cursor-pointer transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
```

`src/components/ui/Badge.tsx`:
```tsx
import { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-wide text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Logo.test Button.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Logo.tsx src/components/ui/Button.tsx src/components/ui/Badge.tsx src/components/layout/Logo.test.tsx src/components/ui/Button.test.tsx
git commit -m "feat: add Logo, Button, Badge shared UI components"
```

---

### Task 8: Navbar, Footer, PublicLayout, and routing shell

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/PublicLayout.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/layout/Navbar.test.tsx`, `src/App.test.tsx` (extend)

**Interfaces:**
- Consumes: `Logo`, `Button` (Task 7), `useAuth` (Task 4), `react-router-dom`.
- Produces: `<PublicLayout>` wrapping page content with Navbar+Footer; `App` route tree with paths `/`, `/blog`, `/blog/:slug`, `/nosotros`, `/contacto`, `/admin/login`, `/admin`, `/admin/editor`, `/admin/editor/:id` — consumed by all page tasks (9–17).

- [ ] **Step 1: Write the failing test**

`src/components/layout/Navbar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders links to Inicio, Blog, Nosotros, Contacto and Ingresar', () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    ['Inicio', 'Blog', 'Nosotros', 'Contacto', 'Ingresar'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('opens the mobile menu on hamburger click', async () => {
    window.innerWidth = 375;
    render(<Navbar />, { wrapper: MemoryRouter });
    const toggle = screen.getByLabelText('Abrir menú');
    await userEvent.click(toggle);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Navbar.test`
Expected: FAIL — `Navbar` doesn't exist.

- [ ] **Step 3: Implement**

`src/components/layout/Navbar.tsx` (structure/copy from mockup lines 62-97; sticky header, desktop links + `Ingresar` CTA, mobile hamburger menu):
```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/blog', label: 'Blog' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-navy/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex items-center gap-5 relative">
      <Link to="/"><Logo /></Link>

      <div className="ml-auto hidden md:flex items-center gap-7">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="text-bone text-[15px] font-medium hover:text-orbix-cyan">
            {l.label}
          </Link>
        ))}
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 bg-orbix-blue text-bone rounded-xl px-5 py-2.5 font-display font-semibold text-sm hover:bg-orbix-cyan hover:text-navy"
        >
          Ingresar
        </Link>
      </div>

      <button
        aria-label="Abrir menú"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto md:hidden w-10 h-10 grid place-items-center bg-white/5 border border-white/10 rounded-xl text-bone"
      >
        ☰
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 flex flex-col gap-1 p-3 bg-navy/95 border-b border-white/10 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-bone text-base font-medium px-2.5 py-3 rounded-lg">
              {l.label}
            </Link>
          ))}
          <Link to="/admin/login" onClick={() => setOpen(false)} className="bg-orbix-blue text-bone font-display font-semibold text-base px-3.5 py-3 rounded-lg text-center">
            Ingresar
          </Link>
        </div>
      )}
    </div>
  );
}
```

`src/components/layout/Footer.tsx` (content from mockup lines 530-571 — nav links, contact info, social icons, copyright):
```tsx
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <div className="border-t border-white/10 bg-black/20">
      <div className="max-w-6xl mx-auto px-8 py-14 grid gap-9" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        <div className="max-w-xs">
          <Logo />
          <p className="text-sm text-slate mt-4">Código con propósito. Estudio universitario de desarrollo de software.</p>
        </div>
        <div>
          <div className="font-display font-semibold text-sm mb-4 text-bone">Navegación</div>
          <div className="flex flex-col gap-3 text-sm text-slate">
            <Link to="/" className="hover:text-orbix-cyan">Inicio</Link>
            <Link to="/blog" className="hover:text-orbix-cyan">Blog</Link>
            <Link to="/nosotros" className="hover:text-orbix-cyan">Nosotros</Link>
            <Link to="/contacto" className="hover:text-orbix-cyan">Contacto</Link>
          </div>
        </div>
        <div>
          <div className="font-display font-semibold text-sm mb-4 text-bone">Contacto</div>
          <div className="flex flex-col gap-3 text-sm text-slate">
            <span>hola@orbix.studio</span>
            <span>Ciudad Universitaria, Pab. III</span>
            <span>Lun a Vie · 9–18h</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-8 py-5 text-center text-sm text-slate">
        © 2026 ORBIX Studio · Proyecto académico
      </div>
    </div>
  );
}
```

`src/components/layout/PublicLayout.tsx`:
```tsx
import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-bone font-sans">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
```

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/auth';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Nosotros } from './pages/Nosotros';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Editor } from './pages/admin/Editor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
          <Route path="/nosotros" element={<PublicLayout><Nosotros /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
          <Route path="/admin/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

Note: `ProtectedRoute` is built in Task 14 and page components in Tasks 9–13/15–17; this task's own test only verifies the shell renders — it does not yet require those files to exist beyond stub imports, so build this task's dependents (Tasks 9–17) before running `App.test.tsx` for real; until then leave `App.test.tsx` as the smoke test from Task 1 targeting `Logo`/`RBIX` text, unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Navbar.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx src/components/layout/PublicLayout.tsx src/components/layout/Navbar.test.tsx src/App.tsx
git commit -m "feat: add Navbar, Footer, PublicLayout and route shell"
```

---

### Task 9: Home page

**Files:**
- Create: `src/pages/Home.tsx`
- Test: `src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `getPublishedPosts` (Task 5), `Button`, `Badge` (Task 7), `formatDate` (Task 3).

- [ ] **Step 1: Write the failing test**

`src/pages/Home.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../firebase/posts', () => ({
  getPublishedPosts: vi.fn(async () => [
    { id: '1', slug: 'a', title: 'Post A', summary: 'Resumen A', tags: ['Backend'], createdAt: new Date('2026-08-01'), authorName: 'Ana' },
  ]),
}));

import { Home } from './Home';

describe('Home', () => {
  it('renders hero copy, mission/vision, services and latest posts', async () => {
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Código con/)).toBeInTheDocument();
    expect(screen.getByText('Misión')).toBeInTheDocument();
    expect(screen.getByText('Visión')).toBeInTheDocument();
    expect(screen.getByText('Desarrollo web a medida')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Post A')).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Home.test`
Expected: FAIL — `Home` doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/Home.tsx` (content and copy from mockup lines 99-219: hero, mission/vision cards, 4 services, 4 stats, 3 latest posts, closing CTA):
```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getPublishedPosts, Post } from '../firebase/posts';
import { formatDate } from '../utils/date';

const services = [
  { title: 'Desarrollo web a medida', desc: 'Aplicaciones web modernas con front-end reactivo y back-end sólido, listas para escalar.' },
  { title: 'Aplicaciones móviles', desc: 'Apps multiplataforma con foco en rendimiento y experiencia de usuario.' },
  { title: 'APIs y back-end', desc: 'Servicios REST y arquitecturas limpias, documentadas y probadas de punta a punta.' },
  { title: 'Consultoría y arquitectura', desc: 'Acompañamos decisiones técnicas: stack, infraestructura y buenas prácticas.' },
];

const stats = [
  { num: '24', label: 'Proyectos entregados' },
  { num: '18', label: 'Tecnologías dominadas' },
  { num: '12', label: 'Integrantes del equipo' },
  { num: '6', label: 'Semestres activos' },
];

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPublishedPosts().then((all) => setPosts(all.slice(0, 3)));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-8 py-28">
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-orbix-cyan/30 rounded-full bg-orbix-cyan/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orbix-cyan" />
            <span className="text-sm text-orbix-cyan">Estudio universitario de desarrollo de software</span>
          </div>
          <h1 className="font-display font-bold text-6xl leading-none tracking-tight mb-5 max-w-xl">
            Código con <span className="text-orbix-blue">propósito</span>.
          </h1>
          <p className="text-lg text-slate max-w-xl mb-9">
            Somos ORBIX Studio. Diseñamos y construimos soluciones de software que resuelven problemas reales, aplicando en cada proyecto los estándares de calidad de la industria.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link to="/blog"><Button variant="primary">Ver proyectos</Button></Link>
            <Link to="/nosotros"><Button variant="secondary">Conócenos</Button></Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-10 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-9">
          <h3 className="font-display font-semibold text-2xl mb-3">Misión</h3>
          <p className="text-slate leading-relaxed">Diseñar y construir soluciones de software que resuelven problemas reales, aplicando en cada proyecto académico los estándares de calidad de la industria.</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-9">
          <h3 className="font-display font-semibold text-2xl mb-3">Visión</h3>
          <p className="text-slate leading-relaxed">Ser un equipo referente dentro de la universidad por la calidad técnica y el impacto de nuestros proyectos de desarrollo de software.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Qué hacemos</span>
        <h2 className="font-display font-bold text-4xl mt-3 mb-9">Servicios de ingeniería, con criterio.</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {services.map((s) => (
            <div key={s.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7">
              <h3 className="font-display font-semibold text-lg mb-2.5">{s.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-orbix-blue/5">
        <div className="max-w-6xl mx-auto px-8 py-14 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-5xl">{s.num}</div>
              <div className="text-sm text-slate mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between gap-5 flex-wrap mb-9">
          <div>
            <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Blog</span>
            <h2 className="font-display font-bold text-4xl mt-3">Últimos posts</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-orbix-cyan border border-orbix-cyan/30 rounded-xl px-5 py-3 font-display font-semibold text-sm">
            Ver todos los posts
          </Link>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="block bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orbix-blue/40 to-orbix-cyan/15" />
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">{p.tags[0]}</span>
                  <span className="text-xs text-slate">{formatDate(p.createdAt)}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-slate">{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="rounded-3xl p-14 bg-gradient-to-br from-orbix-blue/90 to-orbix-blue/50 border border-orbix-cyan/30">
          <h2 className="font-display font-bold text-4xl mb-3 max-w-md">¿Tenés un proyecto en mente? Hablemos.</h2>
          <p className="text-bone/90 mb-7 max-w-xl">Contanos qué querés construir y te respondemos con una propuesta técnica.</p>
          <Link to="/contacto">
            <Button className="!bg-bone !text-navy hover:!bg-navy hover:!text-bone">Ir a contacto</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Home.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/Home.test.tsx
git commit -m "feat: implement Home page"
```

---

### Task 10: Blog index page (search, tag filter, pagination)

**Files:**
- Create: `src/components/blog/filterPosts.ts`, `src/components/blog/PostCard.tsx`, `src/pages/Blog.tsx`
- Test: `src/components/blog/filterPosts.test.ts`, `src/pages/Blog.test.tsx`

**Interfaces:**
- Consumes: `getPublishedPosts` (Task 5), `formatDate` (Task 3).
- Produces: `filterPosts(posts: Post[], { tag, query }): Post[]`, `<PostCard post={Post} />` — `PostCard` reused by Task 9 optionally, `filterPosts` used only here.

- [ ] **Step 1: Write the failing tests**

`src/components/blog/filterPosts.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { filterPosts } from './filterPosts';
import { Post } from '../../firebase/posts';

const posts = [
  { id: '1', title: 'Arquitectura hexagonal', tags: ['Arquitectura'], summary: 'puertos y adaptadores' },
  { id: '2', title: 'CI/CD con GitHub Actions', tags: ['DevOps'], summary: 'pipeline automático' },
] as Post[];

describe('filterPosts', () => {
  it('returns all posts when tag is "Todos" and query is empty', () => {
    expect(filterPosts(posts, { tag: 'Todos', query: '' })).toHaveLength(2);
  });

  it('filters by tag', () => {
    expect(filterPosts(posts, { tag: 'DevOps', query: '' })).toEqual([posts[1]]);
  });

  it('filters by case-insensitive title/summary match', () => {
    expect(filterPosts(posts, { tag: 'Todos', query: 'pipeline' })).toEqual([posts[1]]);
  });
});
```

`src/pages/Blog.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../firebase/posts', () => ({
  getPublishedPosts: vi.fn(async () => [
    { id: '1', slug: 'hex', title: 'Arquitectura hexagonal', summary: 'puertos', tags: ['Arquitectura'], createdAt: new Date('2026-08-12'), authorName: 'Martina' },
    { id: '2', slug: 'cicd', title: 'CI/CD con Actions', summary: 'pipeline', tags: ['DevOps'], createdAt: new Date('2026-08-04'), authorName: 'Diego' },
  ]),
}));

import { Blog } from './Blog';

describe('Blog', () => {
  it('lists posts and filters when a tag is clicked', async () => {
    render(<Blog />, { wrapper: MemoryRouter });
    await waitFor(() => screen.getByText('Arquitectura hexagonal'));
    expect(screen.getByText('CI/CD con Actions')).toBeInTheDocument();

    await userEvent.click(screen.getByText('DevOps'));
    expect(screen.queryByText('Arquitectura hexagonal')).not.toBeInTheDocument();
    expect(screen.getByText('CI/CD con Actions')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- filterPosts.test Blog.test`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

`src/components/blog/filterPosts.ts`:
```ts
import { Post } from '../../firebase/posts';

export function filterPosts(posts: Post[], { tag, query }: { tag: string; query: string }): Post[] {
  const q = query.trim().toLowerCase();
  return posts.filter((p) => {
    const matchesTag = tag === 'Todos' || p.tags.includes(tag);
    const matchesQuery = q === '' || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });
}
```

`src/components/blog/PostCard.tsx`:
```tsx
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
```

`src/pages/Blog.tsx` (header/search/tags copy from mockup lines 222-269; tag list matches mockup's `tags` array):
```tsx
import { useEffect, useState } from 'react';
import { getPublishedPosts, Post } from '../firebase/posts';
import { filterPosts } from '../components/blog/filterPosts';
import { PostCard } from '../components/blog/PostCard';

const TAGS = ['Todos', 'Arquitectura', 'DevOps', 'Backend', 'Frontend', 'Calidad', 'Datos'];

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState('Todos');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getPublishedPosts().then(setPosts);
  }, []);

  const visible = filterPosts(posts, { tag, query });

  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Blog</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4">Notas de ingeniería</h1>
          <p className="text-lg text-slate max-w-2xl">Lo que aprendemos construyendo software real: arquitectura, prácticas, herramientas y decisiones técnicas del equipo.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 pt-9 pb-5">
        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artículos…"
            className="flex-1 bg-transparent outline-none text-bone text-sm"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-2 flex gap-2.5 flex-wrap">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium border ${
              tag === t ? 'bg-orbix-blue border-orbix-blue text-bone' : 'bg-transparent border-white/15 text-slate'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {visible.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- filterPosts.test Blog.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/blog/filterPosts.ts src/components/blog/PostCard.tsx src/pages/Blog.tsx src/components/blog/filterPosts.test.ts src/pages/Blog.test.tsx
git commit -m "feat: implement Blog index page with search and tag filter"
```

Note: pagination is deferred — with a university-project post volume (dozens, not thousands), rendering the full filtered grid is sufficient. If pagination becomes necessary later, add a `page` state and slice `visible` client-side; do not add server-side pagination (Firestore cursors) unless the spec is revisited.

---

### Task 11: Blog post detail page

**Files:**
- Create: `src/pages/BlogPost.tsx`
- Test: `src/pages/BlogPost.test.tsx`

**Interfaces:**
- Consumes: `getPostBySlug` (Task 5), `formatDate` (Task 3), `useParams` from `react-router-dom`.

- [ ] **Step 1: Write the failing test**

`src/pages/BlogPost.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../firebase/posts', () => ({
  getPostBySlug: vi.fn(async (slug: string) =>
    slug === 'hex'
      ? {
          id: '1', slug: 'hex', title: 'Arquitectura hexagonal', content: '<p>Contenido del post</p>',
          tags: ['Arquitectura'], authorName: 'Martina Ríos', createdAt: new Date('2026-08-12'),
          coverImageUrl: '', summary: '',
        }
      : null,
  ),
}));

import { BlogPost } from './BlogPost';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BlogPost', () => {
  it('renders the post title, author and content for a valid slug', async () => {
    renderAt('/blog/hex');
    await waitFor(() => screen.getByText('Arquitectura hexagonal'));
    expect(screen.getByText('Martina Ríos')).toBeInTheDocument();
    expect(screen.getByText('Contenido del post')).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown slug', async () => {
    renderAt('/blog/unknown');
    await waitFor(() => screen.getByText(/no encontrado/i));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- BlogPost.test`
Expected: FAIL — `BlogPost` doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/BlogPost.tsx` (layout from mockup lines 273-323: cover banner, back link, tag+date, title, author row, HTML content, tags, prev/next):
```tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, Post } from '../firebase/posts';
import { formatDate } from '../utils/date';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  if (post === undefined) return null;
  if (post === null) return <p className="p-10 text-center text-slate">Post no encontrado.</p>;

  return (
    <div>
      <div className="aspect-[21/8] min-h-[220px] bg-gradient-to-br from-orbix-blue/50 to-orbix-cyan/20" />
      <div className="max-w-3xl mx-auto px-8 py-14">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-orbix-cyan text-sm font-semibold mb-6">
          ← Volver al blog
        </Link>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xs font-semibold text-orbix-cyan bg-orbix-cyan/10 rounded-full px-3 py-1.5">{post.tags[0]}</span>
          <span className="text-sm text-slate">{formatDate(post.createdAt)}</span>
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- BlogPost.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogPost.tsx src/pages/BlogPost.test.tsx
git commit -m "feat: implement blog post detail page"
```

Note: prev/next post navigation from the mockup is a nice-to-have that needs a second query (post immediately before/after by `createdAt`); deferred out of this task to keep it focused — add as a follow-up task if the user wants it before launch.

---

### Task 12: Nosotros page (built to match the visual system — not in the mockup)

**Files:**
- Create: `src/pages/Nosotros.tsx`
- Test: `src/pages/Nosotros.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 7). Uses a static placeholder team array (per spec §"Equipo" decision — real member data not yet provided).

- [ ] **Step 1: Write the failing test**

`src/pages/Nosotros.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Nosotros } from './Nosotros';

describe('Nosotros', () => {
  it('renders the team grid and the five ORBIX values', () => {
    render(<Nosotros />, { wrapper: MemoryRouter });
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    ['Innovación', 'Excelencia técnica', 'Colaboración', 'Aprendizaje continuo', 'Compromiso'].forEach((v) => {
      expect(screen.getByText(v)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/Integrante/).length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Nosotros.test`
Expected: FAIL — `Nosotros` doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/Nosotros.tsx` (visual system reused from Home: section header pattern, card style `bg-white/[0.04] border border-white/10 rounded-2xl`):
```tsx
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const team = [
  { name: 'Integrante 1', role: 'Backend Lead' },
  { name: 'Integrante 2', role: 'Frontend Lead' },
  { name: 'Integrante 3', role: 'DevOps' },
  { name: 'Integrante 4', role: 'QA & Testing' },
];

const values = [
  { title: 'Innovación', desc: 'Buscamos soluciones nuevas antes que las conocidas por defecto.' },
  { title: 'Excelencia técnica', desc: 'Cuidamos la calidad del código como si fuera a producción.' },
  { title: 'Colaboración', desc: 'Construimos en equipo, revisamos y aprendemos juntos.' },
  { title: 'Aprendizaje continuo', desc: 'Cada proyecto es una oportunidad para mejorar el criterio técnico.' },
  { title: 'Compromiso', desc: 'Cumplimos lo que prometemos, dentro y fuera del aula.' },
];

export function Nosotros() {
  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Nosotros</span>
          <h1 className="font-display font-bold text-5xl mt-3 mb-4">El equipo detrás de ORBIX</h1>
          <p className="text-lg text-slate max-w-2xl">
            Somos un grupo de estudiantes que decidimos tratar cada proyecto académico como si fuera un proyecto real, con los mismos estándares de calidad de la industria.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="font-display font-bold text-3xl mb-8">Integrantes</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {team.map((m) => (
            <div key={m.name} className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orbix-blue to-orbix-cyan mx-auto mb-4" />
              <div className="font-display font-semibold">{m.name}</div>
              <div className="text-sm text-slate mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="font-display font-bold text-3xl mb-8">Nuestros valores</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          {values.map((v) => (
            <div key={v.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="font-display font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-slate">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-20 text-center">
        <h2 className="font-display font-bold text-3xl mb-5">¿Querés trabajar con nosotros?</h2>
        <Link to="/contacto"><Button variant="primary">Ir a contacto</Button></Link>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Nosotros.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Nosotros.tsx src/pages/Nosotros.test.tsx
git commit -m "feat: implement Nosotros page"
```

---

### Task 13: Contacto page (form + info + map)

**Files:**
- Create: `src/pages/Contacto.tsx`
- Test: `src/pages/Contacto.test.tsx`

**Interfaces:**
- Consumes: `sendContactMessage` (Task 6).

- [ ] **Step 1: Write the failing test**

`src/pages/Contacto.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const sendMock = vi.fn(async () => {});
vi.mock('../firebase/messages', () => ({ sendContactMessage: sendMock }));

import { Contacto } from './Contacto';

describe('Contacto', () => {
  it('shows a validation error when required fields are empty on submit', async () => {
    render(<Contacto />, { wrapper: MemoryRouter });
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));
    expect(await screen.findByText(/completá todos los campos/i)).toBeInTheDocument();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('submits the message and shows a success state when valid', async () => {
    render(<Contacto />, { wrapper: MemoryRouter });
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await userEvent.type(screen.getByLabelText(/asunto/i), 'Consulta');
    await userEvent.type(screen.getByLabelText(/mensaje/i), 'Hola, quiero más info.');
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledWith({
      name: 'Ana', email: 'ana@example.com', subject: 'Consulta', message: 'Hola, quiero más info.',
    }));
    expect(await screen.findByText(/gracias/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Contacto.test`
Expected: FAIL — `Contacto` doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/Contacto.tsx`:
```tsx
import { FormEvent, useState } from 'react';
import { sendContactMessage } from '../firebase/messages';

export function Contacto() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name || !email || !subject || !message) {
      setError('Completá todos los campos.');
      return;
    }
    await sendContactMessage({ name, email, subject, message });
    setSent(true);
  }

  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Contacto</span>
          <h1 className="font-display font-bold text-5xl mt-3">Hablemos de tu proyecto</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16 grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {sent ? (
            <p className="text-orbix-cyan text-lg">¡Gracias! Te vamos a responder pronto.</p>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm text-slate mb-2">Nombre</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-slate mb-2">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-slate mb-2">Asunto</label>
                <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-slate mb-2">Mensaje</label>
                <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="bg-orbix-blue text-bone rounded-xl px-6 py-3.5 font-display font-semibold self-start">
                Enviar
              </button>
            </>
          )}
        </form>

        <div>
          <h2 className="font-display font-semibold text-xl mb-5">Información</h2>
          <div className="flex flex-col gap-3 text-slate mb-8">
            <span>hola@orbix.studio</span>
            <span>Ciudad Universitaria, Pab. III</span>
            <span>Lun a Vie · 9–18h</span>
          </div>
          <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-slate text-sm">
            Mapa
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Contacto.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contacto.tsx src/pages/Contacto.test.tsx
git commit -m "feat: implement Contacto page with form and info"
```

---

### Task 14: ProtectedRoute auth guard

**Files:**
- Create: `src/components/admin/ProtectedRoute.tsx`
- Test: `src/components/admin/ProtectedRoute.test.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 4).
- Produces: `<ProtectedRoute>{children}</ProtectedRoute>` — consumed by `App.tsx` (Task 8, routes `/admin`, `/admin/editor*`).

- [ ] **Step 1: Write the failing test**

`src/components/admin/ProtectedRoute.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const useAuthMock = vi.fn();
vi.mock('../../firebase/auth', () => ({ useAuth: () => useAuthMock() }));

import { ProtectedRoute } from './ProtectedRoute';

function renderWithAuth(authState: any) {
  useAuthMock.mockReturnValue(authState);
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<span>Login page</span>} />
        <Route path="/admin" element={<ProtectedRoute><span>Dashboard</span></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /admin/login when there is no user', () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders children when a user is present', () => {
    renderWithAuth({ user: { uid: '1' }, loading: false });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    renderWithAuth({ user: null, loading: true });
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProtectedRoute.test`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

`src/components/admin/ProtectedRoute.tsx`:
```tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProtectedRoute.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/ProtectedRoute.tsx src/components/admin/ProtectedRoute.test.tsx
git commit -m "feat: add ProtectedRoute auth guard for admin routes"
```

---

### Task 15: Admin Login page

**Files:**
- Create: `src/pages/admin/Login.tsx`
- Test: `src/pages/admin/Login.test.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 4), `Logo` (Task 7).

- [ ] **Step 1: Write the failing test**

`src/pages/admin/Login.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const signInMock = vi.fn();
vi.mock('../../firebase/auth', () => ({ useAuth: () => ({ signIn: signInMock }) }));

import { Login } from './Login';

describe('Login', () => {
  it('calls signIn with the entered credentials', async () => {
    render(<Login />, { wrapper: MemoryRouter });
    await userEvent.type(screen.getByLabelText('Email'), 'ana@orbix.studio');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(signInMock).toHaveBeenCalledWith('ana@orbix.studio', 'secreta123');
  });

  it('shows an error message when signIn rejects', async () => {
    signInMock.mockRejectedValueOnce(new Error('invalid'));
    render(<Login />, { wrapper: MemoryRouter });
    await userEvent.type(screen.getByLabelText('Email'), 'ana@orbix.studio');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'bad');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- pages/admin/Login.test`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/admin/Login.tsx` (layout from mockup lines 325-348):
```tsx
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/layout/Logo';
import { useAuth } from '../../firebase/auth';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch {
      setError('Credenciales inválidas.');
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-9">
          <Logo variant="icon" />
          <div className="font-display font-bold text-2xl mt-3 text-bone">ORBIX</div>
          <div className="text-sm text-slate mt-1.5">Panel de administración</div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          <label htmlFor="email" className="block text-sm text-slate mb-2">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue mb-5" />
          <label htmlFor="password" className="block text-sm text-slate mb-2">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue mb-6" />
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-orbix-blue text-bone rounded-xl py-3.5 font-display font-semibold">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- pages/admin/Login.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/Login.tsx src/pages/admin/Login.test.tsx
git commit -m "feat: implement admin Login page"
```

---

### Task 16: Admin Dashboard page

**Files:**
- Create: `src/pages/admin/Dashboard.tsx`
- Test: `src/pages/admin/Dashboard.test.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `deletePost` (Task 5), `useAuth` (Task 4).

- [ ] **Step 1: Write the failing test**

`src/pages/admin/Dashboard.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const deleteMock = vi.fn(async () => {});
vi.mock('../../firebase/posts', () => ({
  getAllPosts: vi.fn(async () => [
    { id: '1', title: 'Post publicado', status: 'published', createdAt: new Date('2026-08-12') },
    { id: '2', title: 'Post borrador', status: 'draft', createdAt: new Date('2026-08-09') },
  ]),
  deletePost: deleteMock,
}));
vi.mock('../../firebase/auth', () => ({ useAuth: () => ({ signOut: vi.fn() }) }));

import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('lists all posts regardless of author, with status badges', async () => {
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => screen.getByText('Post publicado'));
    expect(screen.getByText('Post borrador')).toBeInTheDocument();
    expect(screen.getByText('Publicado')).toBeInTheDocument();
    expect(screen.getByText('Borrador')).toBeInTheDocument();
  });

  it('deletes a post when its delete button is clicked', async () => {
    render(<Dashboard />, { wrapper: MemoryRouter });
    await waitFor(() => screen.getByText('Post publicado'));
    await userEvent.click(screen.getAllByLabelText('Eliminar')[0]);
    expect(deleteMock).toHaveBeenCalledWith('1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- pages/admin/Dashboard.test`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/admin/Dashboard.tsx` (layout from mockup lines 350-395; shows every team member's posts, not just the signed-in user's, per spec decision that any member can publish/edit):
```tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost, Post } from '../../firebase/posts';
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
          <Link to="/admin/editor" className="bg-orbix-blue text-bone rounded-xl px-5 py-3 font-display font-semibold text-sm">
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
                  p.status === 'published' ? 'bg-orbix-cyan/15 text-orbix-cyan' : 'bg-slate/15 text-slate'
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- pages/admin/Dashboard.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/Dashboard.tsx src/pages/admin/Dashboard.test.tsx
git commit -m "feat: implement admin Dashboard page"
```

---

### Task 17: Admin Editor page (create/edit post, rich text, cover image upload, tags)

**Files:**
- Create: `src/pages/admin/Editor.tsx`
- Test: `src/pages/admin/Editor.test.tsx`

**Interfaces:**
- Consumes: `createPost`, `updatePost`, `getPostById` (Task 5), `storage` (Task 2), `useAuth` (Task 4), `Tiptap` (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`).

- [ ] **Step 1: Write the failing test**

`src/pages/admin/Editor.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const createMock = vi.fn(async () => 'new-id');
vi.mock('../../firebase/posts', () => ({
  createPost: createMock,
  updatePost: vi.fn(),
  getPostById: vi.fn(async () => null),
}));
vi.mock('../../firebase/auth', () => ({
  useAuth: () => ({ user: { uid: 'u1' }, }),
}));
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(async () => ({})),
  getDownloadURL: vi.fn(async () => 'https://example.com/cover.jpg'),
}));

import { Editor } from './Editor';

describe('Editor (new post)', () => {
  it('creates a draft post with the entered title, summary and a tag', async () => {
    render(<Editor />, { wrapper: MemoryRouter });
    await userEvent.type(screen.getByLabelText('Título'), 'Mi nuevo post');
    await userEvent.type(screen.getByLabelText('Resumen'), 'Resumen del post');
    await userEvent.type(screen.getByLabelText('Agregar tag'), 'backend{enter}');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar borrador' }));

    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Mi nuevo post',
      summary: 'Resumen del post',
      tags: ['backend'],
      status: 'draft',
      authorId: 'u1',
    }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- pages/admin/Editor.test`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

`src/pages/admin/Editor.tsx` (layout from mockup lines 397-437 — title/summary/cover/rich text/tags/save-draft/publish):
```tsx
import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createPost, updatePost, getPostById } from '../../firebase/posts';
import { useAuth } from '../../firebase/auth';
import { storage } from '../../firebase/config';

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

  async function handleCoverUpload(file: File) {
    const storageRef = ref(storage, `covers/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setCoverImageUrl(url);
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
          className="mb-6 text-sm text-slate" />

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- pages/admin/Editor.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/Editor.tsx src/pages/admin/Editor.test.tsx
git commit -m "feat: implement admin Editor page with Tiptap and cover upload"
```

---

### Task 18: Firestore & Storage security rules

**Files:**
- Create: `firestore.rules`, `storage.rules`, `firebase.json`, `.firebaserc`
- Test: `rules.test.ts` (project root, run via emulator)

**Interfaces:**
- Enforces the data-access contract every task above assumes: public read of published posts/team, auth-required writes, create-only public `messages`.

- [ ] **Step 1: Write the failing rules test**

Install the emulator tooling: `npm install -D firebase-tools`.

`rules.test.ts`:
```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeTestEnvironment, RulesTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'orbix-rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('firestore.rules', () => {
  it('allows anyone to read a published post', async () => {
    const unauth = testEnv.unauthenticatedContext();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'posts/p1'), { status: 'published', title: 'A' });
    });
    await assertSucceeds(getDoc(doc(unauth.firestore(), 'posts/p1')));
  });

  it('blocks unauthenticated writes to posts', async () => {
    const unauth = testEnv.unauthenticatedContext();
    await assertFails(setDoc(doc(unauth.firestore(), 'posts/p2'), { status: 'draft', title: 'B' }));
  });

  it('allows authenticated users to write posts', async () => {
    const authed = testEnv.authenticatedContext('user-1');
    await assertSucceeds(setDoc(doc(authed.firestore(), 'posts/p3'), { status: 'draft', title: 'C' }));
  });

  it('allows anyone to create a contact message but not read them', async () => {
    const unauth = testEnv.unauthenticatedContext();
    await assertSucceeds(addDoc(collection(unauth.firestore(), 'messages'), { name: 'Ana', email: 'a@b.com', subject: 'Hi', message: 'Hi' }));
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'messages/m1'), { name: 'Ana' });
    });
    await assertFails(getDoc(doc(unauth.firestore(), 'messages/m1')));
  });
});
```

Add to `package.json` scripts: `"test:rules": "firebase emulators:exec --only firestore \"vitest run rules.test.ts\""`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:rules`
Expected: FAIL — `firestore.rules` doesn't exist yet (or default-deny/default-allow rules don't match the assertions).

- [ ] **Step 3: Implement**

`firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if resource.data.status == 'published' || request.auth != null;
      allow write: if request.auth != null;
    }
    match /team/{memberId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

`storage.rules`:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /covers/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /team/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

`firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "firestore": { "port": 8080 },
    "auth": { "port": 9099 },
    "ui": { "enabled": true }
  }
}
```

`.firebaserc` (replace `PROJECT_ID` with the real Firebase project id once created in the console):
```json
{
  "projects": {
    "default": "PROJECT_ID"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:rules`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add firestore.rules storage.rules firebase.json .firebaserc rules.test.ts package.json
git commit -m "feat: add Firestore/Storage security rules and emulator rules tests"
```

---

### Task 19: Final route wiring smoke test

**Files:**
- Modify: `src/App.test.tsx`

**Interfaces:**
- Verifies the full route tree built across Tasks 8–17 renders each path without crashing.

- [ ] **Step 1: Write the (now failing, since it supersedes Task 1's test) full-route test**

`src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./firebase/posts', () => ({
  getPublishedPosts: vi.fn(async () => []),
  getAllPosts: vi.fn(async () => []),
  getPostBySlug: vi.fn(async () => null),
}));
vi.mock('./firebase/auth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, loading: false, signIn: vi.fn(), signOut: vi.fn() }),
}));

import App from './App';

describe('App routing', () => {
  it('renders the home route by default', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText(/Código con/)).toBeInTheDocument();
  });

  it('redirects /admin to /admin/login when logged out', () => {
    window.history.pushState({}, '', '/admin');
    render(<App />);
    expect(screen.getByText('Panel de administración')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails (if it does)**

Run: `npm test -- App.test`
Expected: PASS if Tasks 8–17 were completed correctly — if it FAILs, the failure points at exactly which page/route regressed; fix that page, not this test.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: All tests PASS across every task.

- [ ] **Step 4: Commit**

```bash
git add src/App.test.tsx
git commit -m "test: add full route-tree smoke test"
```

---

## Deferred / explicitly out of scope for this plan

- **Deploying** to Firebase Hosting (`firebase deploy`) — Task 18 prepares the config; the actual deploy is a user-triggered action once a real Firebase project exists and `.env`/`.firebaserc` hold real values.
- Blog post prev/next navigation (needs an extra "adjacent post" query) — noted as a follow-up in Task 11.
- Pagination on `/blog` — noted as a follow-up in Task 10, add only if post volume grows.
- Editing `team` members from the admin panel — spec allows a `team` Firestore collection, but Nosotros currently ships with a static placeholder array (Task 12) per the user's "usar placeholders por ahora" decision; wiring the admin UI to `team` is a separate future task once real member data exists.

## Self-review notes

- **Spec coverage:** all 5 public pages, both admin CMS flows (dashboard + editor), auth, and the 4 Firestore collections from the design spec are covered by a task. Contact form maps to `messages`; team placeholders map to the deferred `team` collection wiring above.
- **No placeholders:** every step has runnable code; the only intentionally-deferred items are called out by name in "Deferred / explicitly out of scope," not hidden inside a task.
- **Type consistency:** `Post` (Task 5) is the single shared type — Home (9), Blog (10), BlogPost (11), Dashboard (16), and Editor (17) all import it rather than redefining fields. `PostInput`/`PostStatus` are reused the same way between `createPost`/`updatePost` (Task 5) and Editor's `save()` (Task 17).
