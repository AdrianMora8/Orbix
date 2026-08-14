import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
};

const styles = {
  primary: 'bg-orbix-blue text-bone hover:bg-orbix-cyan hover:text-navy',
  secondary: 'bg-transparent text-bone border border-white/20 hover:border-orbix-cyan hover:text-orbix-cyan',
  ghost: 'bg-transparent text-orbix-cyan hover:text-orbix-blue px-0',
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-2 rounded-xl px-7 py-4 font-display font-semibold text-base cursor-pointer transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
