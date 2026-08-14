import { useState } from 'react';
import type { TocSection } from '../../utils/useTableOfContents';

function scrollToSection(e: React.MouseEvent, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

export function TableOfContentsSidebar({ sections }: { sections: TocSection[] }) {
  if (sections.length === 0) return null;
  return (
    <nav className="hidden lg:block sticky top-24 self-start w-64 flex-none">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <span className="text-xs font-mono uppercase tracking-widest text-orbix-lime">Contenidos</span>
        <ol className="mt-4 flex flex-col gap-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => scrollToSection(e, s.id)}
                className="group flex items-start gap-3 rounded-lg px-2 py-2 -mx-2 hover:bg-orbix-violet/10"
              >
                <span className="flex-none mt-0.5 w-6 h-6 rounded-full border border-orbix-violet/40 bg-orbix-violet/10 grid place-items-center text-[11px] font-mono text-orbix-violet group-hover:border-orbix-lime/50 group-hover:text-orbix-lime group-hover:bg-orbix-lime/10">
                  {i + 1}
                </span>
                <span className="text-sm text-slate leading-snug pt-0.5 group-hover:text-bone">{s.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export function TableOfContentsModal({ sections }: { sections: TocSection[] }) {
  const [open, setOpen] = useState(false);
  if (sections.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver contenidos"
        className="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-orbix-violet text-bone grid place-items-center shadow-[0_0_20px_rgba(124,58,237,0.5)]"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70 flex items-end" onClick={() => setOpen(false)}>
          <div
            className="bg-navy border-t border-orbix-violet/30 rounded-t-2xl w-full max-h-[75vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-orbix-lime">Contenidos</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-slate hover:text-bone">✕</button>
            </div>
            <ol className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => { scrollToSection(e, s.id); setOpen(false); }}
                    className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-orbix-violet/10"
                  >
                    <span className="flex-none mt-0.5 w-6 h-6 rounded-full border border-orbix-violet/40 bg-orbix-violet/10 grid place-items-center text-[11px] font-mono text-orbix-violet">
                      {i + 1}
                    </span>
                    <span className="text-sm text-bone leading-snug pt-0.5">{s.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
