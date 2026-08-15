import { FormEvent, useState } from 'react';
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
      <section className="orbit-hero orbit-mesh-bg relative border-b border-white/10 px-8 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between flex-wrap gap-4">
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
              <button type="submit" className="bg-orbix-violet text-bone rounded-xl px-6 py-3.5 font-display font-semibold self-start">
                Enviar
              </button>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-orbix-lime/30 text-orbix-lime rounded-xl px-6 py-3.5 font-display font-semibold"
              >
                Enviar por WhatsApp
              </a>
            </>
          )}
        </form>

        <div>
          <h2 className="font-display font-semibold text-xl mb-5">Información</h2>
          <div className="flex flex-col gap-3 text-slate mb-8">
            <span>Orbix@uta.edu.ec</span>
            <span>Universidad Técnica de Ambato, Campus Huachi</span>
            <span>Lun a Vie · 9–18h</span>
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
