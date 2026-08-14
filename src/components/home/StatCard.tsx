import { useCountUp } from '../../utils/useCountUp';

type StatCardProps = { num: string; label: string; icon: string };

export function StatCard({ num, label, icon }: StatCardProps) {
  const target = parseInt(num, 10) || 0;
  const { ref, value } = useCountUp<HTMLDivElement>(target);

  return (
    <div ref={ref} className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-orbix-lime flex-none mt-1">
        <path d={icon} />
      </svg>
      <div>
        <div className="font-display font-bold text-3xl">{value}</div>
        <div className="text-sm text-slate mt-1">{label}</div>
      </div>
    </div>
  );
}
