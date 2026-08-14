import { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-wide text-orbix-cyan bg-orbix-cyan/10 rounded-full px-2.5 py-1">
      {children}
    </span>
  );
}
