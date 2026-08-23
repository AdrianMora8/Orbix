import { useTheme } from '../../utils/useTheme';

type LogoProps = {
  variant?: 'wordmark' | 'icon';
  /** Forzar un tema puntual (p. ej. sobre una superficie que no sigue el tema global). Por defecto usa el tema activo de la app. */
  theme?: 'dark' | 'light';
};

export function Logo({ variant = 'wordmark', theme }: LogoProps) {
  const { theme: activeTheme } = useTheme();
  const resolvedTheme = theme ?? activeTheme;
  const ring = '#7C3AED';
  const cross = resolvedTheme === 'light' ? '#375510' : '#B6FF3C';
  const text = resolvedTheme === 'dark' ? '#F5F5FA' : '#1B1730';

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
