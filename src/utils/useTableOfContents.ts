import { useLayoutEffect, useState } from 'react';

export type TocSection = { id: string; text: string };

export function useTableOfContents(contentRef: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const [sections, setSections] = useState<TocSection[]>([]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const headings = Array.from(el.querySelectorAll('h2'));
    const next = headings.map((h, i) => {
      const id = `section-${i + 1}`;
      h.id = id;
      return { id, text: h.textContent ?? '' };
    });
    setSections(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return sections;
}
