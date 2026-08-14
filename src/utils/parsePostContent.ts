export type TocSection = { id: string; text: string };

export function parsePostContent(html: string): { html: string; sections: TocSection[] } {
  if (!html) return { html: '', sections: [] };
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const headings = Array.from(doc.body.querySelectorAll('h2'));
  const sections: TocSection[] = headings.map((h, i) => {
    const id = `section-${i + 1}`;
    h.id = id;
    return { id, text: h.textContent ?? '' };
  });
  return { html: doc.body.innerHTML, sections };
}
