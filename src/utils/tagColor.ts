const PALETTE: Record<string, string> = {
  Arquitectura: '#A78BFA',
  DevOps: '#5FD4D0',
  Backend: '#2E6BFF',
  Frontend: '#F5A623',
  Calidad: '#34D399',
  Datos: '#F472B6',
};

export function tagColor(tag: string | undefined): string {
  if (!tag) return '#5FD4D0';
  return PALETTE[tag] ?? '#5FD4D0';
}

export function readingTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
