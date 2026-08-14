import { StatusBadge } from '../ui/StatusBadge';

const readings = [
  { label: 'Proyectos activos', value: '5' },
  { label: 'Stack dominado', value: '10+' },
  { label: 'Sprint actual', value: '3/6' },
];

export function StatusPanel() {
  return (
    <div className="w-full max-w-xs bg-white/[0.04] border border-white/10 rounded-2xl p-5 font-mono">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-widest text-slate">Estado del sistema</span>
        <StatusBadge pulse>En línea</StatusBadge>
      </div>
      <div className="flex flex-col gap-3">
        {readings.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-slate">{r.label}</span>
            <span className="text-orbix-cyan font-semibold">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
