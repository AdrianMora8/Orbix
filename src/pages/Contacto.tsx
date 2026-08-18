import { useState } from 'react';
import type { FormEvent } from 'react';
import { sendContactMessage } from '../firebase/messages';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScrollCue } from '../components/ui/ScrollCue';

const SUBJECTS = ['Nuevo proyecto', 'Consulta general', 'Colaboración académica', 'Otro'];
const WHATSAPP_NUMBER = '593963224413';

function isOfficeHoursNow(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

const INFO_ITEMS = [
  {
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    label: 'Email',
    value: 'orbix@uta.edu.ec',
    href: 'mailto:orbix@uta.edu.ec',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    label: 'Ubicación',
    value: 'Universidad Técnica de Ambato, Campus Huachi',
    href: 'https://maps.google.com/?q=Universidad+Técnica+de+Ambato+Campus+Huachi',
  },
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Horario',
    value: 'Lunes a Viernes · 9:00 – 18:00',
    href: null,
  },
];

export function Contacto() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const available = isOfficeHoursNow();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name || !email || !subject || !message) {
      setError('Completa todos los campos.');
      return;
    }
    await sendContactMessage({ name, email, subject, message });
    setSent(true);
  }

  function whatsappHref() {
    const text = encodeURIComponent(`Hola ORBIX, soy ${name || '...'} y quiero hablar sobre: ${subject || 'un proyecto'}.`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  return (
    <div>
      <section className="orbit-hero orbit-mesh-bg relative border-b border-white/10 px-8 flex items-center overflow-hidden">
        {/* Elemento decorativo orbital */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block" aria-hidden>
          <div className="relative w-72 h-72 opacity-20">
            <div className="absolute inset-0 rounded-full border border-orbix-violet/60 orbit-ring-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-orbix-violet/30 border border-orbix-violet/60 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orbix-lime">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div>
            <span className="orbit-enter orbit-enter-1 block text-sm font-semibold tracking-widest text-orbix-violet uppercase">Contacto</span>
            <h1 className="orbit-enter orbit-enter-2 font-display font-bold text-5xl mt-3">Hablemos de tu proyecto</h1>
          </div>
          <div className="orbit-enter orbit-enter-3">
            <StatusBadge color={available ? '#B6FF3C' : '#948FA3'} pulse={available}>
              {available ? 'Disponible ahora' : 'Fuera de horario'}
            </StatusBadge>
          </div>
        </div>
        <ScrollCue />
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16 grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {sent ? (
            <p className="text-orbix-lime text-lg">¡Gracias! Te vamos a responder pronto.</p>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm text-slate mb-2">Nombre</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-slate mb-2">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-slate mb-2">Asunto</label>
                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet">
                  <option value="" disabled>Selecciona una opción</option>
                  {SUBJECTS.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-slate mb-2">Mensaje</label>
                <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-violet" />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="bg-orbix-violet text-bone rounded-xl px-6 py-3.5 font-display font-semibold self-start hover:bg-orbix-lime hover:text-navy transition-colors">
                Enviar
              </button>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-orbix-lime/30 text-orbix-lime rounded-xl px-6 py-3.5 font-display font-semibold hover:bg-orbix-lime/10 transition-colors"
              >
                Enviar por WhatsApp
              </a>
            </>
          )}
        </form>

        <div>
          <h2 className="font-display font-semibold text-xl mb-7">Información de contacto</h2>
          <div className="flex flex-col gap-5 mb-8">
            {INFO_ITEMS.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orbix-violet/10 border border-orbix-violet/20 flex-shrink-0 grid place-items-center">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orbix-violet">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate mb-1">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      className="text-sm text-bone hover:text-orbix-lime transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-bone">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
            <iframe
              title="Ubicación ORBIX Studio"
              src="https://www.google.com/maps?q=Universidad+Técnica+de+Ambato+Campus+Huachi&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
