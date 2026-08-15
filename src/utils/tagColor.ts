const PALETTE: Record<string, string> = {
  Arquitectura: '#A78BFA',
  Backend: '#7C3AED',
  Frontend: '#F5A623',
  'IA & Automatización': '#B6FF3C',
  'Buenas Prácticas': '#34D399',
  Herramientas: '#F472B6',
};

export function tagColor(tag: string | undefined): string {
  if (!tag) return '#B6FF3C';
  return PALETTE[tag] ?? '#B6FF3C';
}

export function readingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
