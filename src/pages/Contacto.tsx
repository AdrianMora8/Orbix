import { FormEvent, useState } from 'react';
import { sendContactMessage } from '../firebase/messages';

export function Contacto() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name || !email || !subject || !message) {
      setError('Completá todos los campos.');
      return;
    }
    await sendContactMessage({ name, email, subject, message });
    setSent(true);
  }

  return (
    <div>
      <section className="border-b border-white/10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold tracking-widest text-orbix-blue uppercase">Contacto</span>
          <h1 className="font-display font-bold text-5xl mt-3">Hablemos de tu proyecto</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16 grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {sent ? (
            <p className="text-orbix-cyan text-lg">¡Gracias! Te vamos a responder pronto.</p>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm text-slate mb-2">Nombre</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-slate mb-2">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-slate mb-2">Asunto</label>
                <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-slate mb-2">Mensaje</label>
                <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone outline-none focus:border-orbix-blue" />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="bg-orbix-blue text-bone rounded-xl px-6 py-3.5 font-display font-semibold self-start">
                Enviar
              </button>
            </>
          )}
        </form>

        <div>
          <h2 className="font-display font-semibold text-xl mb-5">Información</h2>
          <div className="flex flex-col gap-3 text-slate mb-8">
            <span>hola@orbix.studio</span>
            <span>Ciudad Universitaria, Pab. III</span>
            <span>Lun a Vie · 9–18h</span>
          </div>
          <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 grid place-items-center text-slate text-sm">
            Mapa
          </div>
        </div>
      </section>
    </div>
  );
}
