import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-bone font-sans">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
