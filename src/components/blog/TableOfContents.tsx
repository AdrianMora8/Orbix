import { useState } from 'react';
import type { TocSection } from '../../utils/useTableOfContents';

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function TableOfContentsSidebar({ sections }: { sections: TocSection[] }) {
  if (sections.length === 0) return null;
  return (
    <nav className="hidden lg:block sticky top-24 self-start w-64 flex-none">
      <span className="text-xs font-mono uppercase tracking-widest text-slate">Contenidos</span>
      <ol className="mt-4 flex flex-col gap-3 border-l border-white/10 pl-4">
        {sections.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => scrollToSection(s.id)}
              className="text-left text-sm text-slate hover:text-orbix-lime leading-snug"
            >
              <span className="text-orbix-violet font-mono mr-1.5">{i + 1}.</span>
              {s.text}
            </button>
          </li>
        ))}
      </ol>
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
        className="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-orbix-violet text-bone grid place-items-center shadow-lg"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70 flex items-end" onClick={() => setOpen(false)}>
          <div
            className="bg-navy border-t border-white/10 rounded-t-2xl w-full max-h-[75vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-slate">Contenidos</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-slate hover:text-bone">✕</button>
            </div>
            <ol className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => { scrollToSection(s.id); setOpen(false); }}
                    className="w-full text-left px-3 py-3 rounded-lg text-sm text-bone hover:bg-white/5"
                  >
                    <span className="text-orbix-violet font-mono mr-2">{i + 1}.</span>
                    {s.text}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
