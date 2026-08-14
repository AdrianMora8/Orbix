const TECHS = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Firebase', 'Tailwind'];

export function TechOrbit() {
  const radius = 130;
  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-8 rounded-full border border-white/5" />
      <div className="orbit-ring-spin absolute inset-0">
        {TECHS.map((tech, i) => {
          const angle = (i / TECHS.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <span
              key={tech}
              className="orbit-ring-spin-reverse absolute text-xs font-mono text-orbix-lime bg-navy border border-orbix-lime/30 rounded-full px-2.5 py-1 whitespace-nowrap"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {tech}
            </span>
          );
        })}
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span className="w-2.5 h-2.5 rounded-full bg-orbix-violet shadow-[0_0_16px_4px_rgba(124,58,237,0.5)] animate-pulse" />
      </div>
    </div>
  );
}
