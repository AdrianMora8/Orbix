# ORBIX Studio — Sitio web institucional + Blog + CMS

**Fecha:** 2026-08-12
**Contexto:** Proyecto universitario. Sitio web tipo empresa de desarrollo de software, con blog para publicar los trabajos del equipo, página de equipo ("Nosotros") y página de contacto. Diseño moderno y serio.

## 1. Identidad de marca (ficticia, generada para el proyecto)

- **Nombre:** ORBIX Studio
- **Tagline:** "Código con propósito."
- **Logo (concepto):** Monograma "O" formado por un arco orbital incompleto rodeando una "X" minimalista en el centro. Wordmark "ORBIX" en sans-serif geométrica bold, con el ícono orbital reemplazando la O.
- **Paleta:**
  - Azul marino profundo `#0A1128` — fondo/base
  - Azul eléctrico `#2E6BFF` — acento primario (CTAs, links)
  - Cian suave `#5FD4D0` — acento secundario (hover, highlights)
  - Blanco hueso `#F5F7FA` — texto sobre fondo oscuro
  - Gris pizarra `#8A94A6` — texto secundario
- **Tipografía:** Titulares en sans-serif geométrica (Space Grotesk / Sora); cuerpo en Inter.
- **Misión:** Diseñar y construir soluciones de software que resuelven problemas reales, aplicando en cada proyecto académico los estándares de calidad de la industria.
- **Visión:** Ser un equipo referente dentro de la universidad por la calidad técnica y el impacto de nuestros proyectos de desarrollo de software.
- **Valores:** Innovación, Excelencia técnica, Colaboración, Aprendizaje continuo, Compromiso.

## 2. Arquitectura técnica

- **Frontend:** Vite + React 18 + TypeScript + React Router.
- **Estilos:** Tailwind CSS, con tokens de la paleta ORBIX configurados en `tailwind.config`. Componentes reutilizables: Navbar, Footer, Button, Card, Section, Badge.
- **Backend/CMS:** Firebase (todo en un solo proyecto):
  - **Firebase Auth** (email/password) — login de los integrantes del equipo para publicar en el blog.
  - **Firestore** — colecciones `posts`, `team`, `messages`, `users` (ver modelo de datos).
  - **Firebase Storage** — imágenes de portada y del cuerpo de los posts, y fotos de equipo.
- **Editor de contenido:** editor rich-text (tiptap o react-quill) en el panel admin para texto formateado + inserción de imágenes en el cuerpo del post.
- **Hosting:** Firebase Hosting (build estático de Vite, rewrites para SPA), mismo proyecto que el resto de servicios Firebase.
- **Arquitectura de la app:** app única (no monorepo). Rutas públicas y rutas `/admin/*` protegidas conviven en el mismo codebase, protegidas por un guard que verifica sesión de Firebase Auth.

## 3. Rutas y páginas

- `/` — Home
- `/blog` — índice del blog
- `/blog/:slug` — entrada individual
- `/nosotros` — equipo
- `/contacto` — contacto
- `/admin/login` — login del panel
- `/admin` — panel de administración (protegido)

### Home (`/`)
Navbar → Hero (nombre, tagline, CTA "Ver proyectos" / "Conócenos") → Misión/Visión (dos columnas con imagen) → Servicios/Qué hacemos (grid de 3-4 tarjetas) → Stats destacados (proyectos realizados, tecnologías, integrantes) → Últimos posts del blog (3 tarjetas, "Ver todos") → CTA final de contacto → Footer.

### Blog (`/blog`)
Header de sección + búsqueda/filtro por tag + índice/listado en grid de tarjetas (imagen, título, resumen, fecha, autor, tag) con paginación. Cada tarjeta enlaza a `/blog/:slug`.

### Entrada individual (`/blog/:slug`)
Imagen de portada, título, metadata (autor/fecha/tags), contenido con imágenes embebidas, navegación a post anterior/siguiente, botón volver al índice.

### Nosotros (`/nosotros`)
Hero de sección → historia/qué es ORBIX Studio → grid de tarjetas de integrantes (foto placeholder, nombre, rol, redes) → valores (íconos + texto) → CTA a contacto.

### Contacto (`/contacto`)
Hero breve ("Hablemos de tu proyecto") → formulario de contacto (nombre, email, asunto, mensaje; guarda en colección `messages`) → info de la empresa (dirección/ubicación, email, teléfono, horario) → redes sociales → mapa embebido (Google Maps iframe o placeholder). Footer replica los datos de contacto.

### Admin (`/admin/login`, `/admin`)
Login con Firebase Auth → panel con lista de posts (editar/eliminar) → formulario crear/editar post (título, resumen, contenido rich-text, imagen de portada, tags, estado draft/publicado).

## 4. Modelo de datos (Firestore)

```
posts {
  id, slug, title, summary, content (HTML),
  coverImageUrl, authorId, authorName, tags: string[],
  status: "draft" | "published",
  createdAt, updatedAt
}

team {
  id, name, role, photoUrl, bio,
  socials: { linkedin?, github?, email? }
}

messages {
  id, name, email, subject, message, createdAt
}

users {
  uid, name, role: "admin" | "member"
}
```

## 5. Fuera de alcance (YAGNI)

- Multi-idioma.
- Comentarios en posts del blog.
- Roles granulares más allá de admin/member.
- Búsqueda full-text avanzada (se usa filtro simple por tag/texto en cliente).
- Analytics/SEO avanzado.

## 6. Siguiente paso

Generar un prompt de diseño visual completo (para una herramienta de diseño de Claude) que describa marca, paleta, tipografía y estructura de cada página, de modo que el usuario obtenga mockups/dirección visual antes de que se implemente el código. Luego, ese resultado se usa como referencia visual para la implementación real en React.
