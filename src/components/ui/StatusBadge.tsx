type StatusBadgeProps = {
  color?: string;
  children: React.ReactNode;
  pulse?: boolean;
};

export function StatusBadge({ color = '#B6FF3C', children, pulse = false }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate border border-white/10 bg-white/[0.03] rounded-full px-3 py-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full ${pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}
