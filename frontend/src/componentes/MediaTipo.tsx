import { TipoCriatura } from "../tipos";

/**
 * Ilustración generativa por tipo de criatura (sin imágenes externas).
 * Si luego hay fotos reales, basta con reemplazar este componente.
 */
const FONDO: Record<TipoCriatura, string> = {
  mitica: "from-emerald-700 via-emerald-900 to-emerald-950",
  elemental: "from-orange-700 via-orange-900 to-emerald-950",
  mecanica: "from-stone-600 via-zinc-800 to-zinc-950",
  espectral: "from-violet-500 via-purple-800 to-purple-950",
};

const VELO: Record<TipoCriatura, string> = {
  mitica: "from-emerald-950/80",
  elemental: "from-emerald-950/80",
  mecanica: "from-zinc-950/80",
  espectral: "from-purple-950/80",
};

function Emblema({ tipo }: { tipo: TipoCriatura }) {
  const trazo = { stroke: "rgba(236,253,245,0.55)", fill: "none", strokeWidth: 1.5 };
  switch (tipo) {
    case "mitica":
      return (
        <g {...trazo}>
          <polygon points="100,28 118,82 172,82 128,114 146,168 100,136 54,168 72,114 28,82 82,82" />
          <circle cx="100" cy="100" r="78" strokeDasharray="2 7" />
        </g>
      );
    case "elemental":
      return (
        <g {...trazo}>
          <polygon points="100,30 170,100 100,170 30,100" />
          <polygon points="100,58 142,100 100,142 58,100" />
          <circle cx="100" cy="100" r="12" />
        </g>
      );
    case "mecanica":
      return (
        <g {...trazo}>
          <circle cx="100" cy="100" r="46" />
          <circle cx="100" cy="100" r="18" />
          <circle cx="100" cy="100" r="68" strokeDasharray="10 8" strokeWidth="10" stroke="rgba(236,253,245,0.25)" />
        </g>
      );
    default:
      return (
        <g {...trazo}>
          {[22, 44, 66, 88].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} opacity={1 - i * 0.2} />
          ))}
          <circle cx="100" cy="100" r="5" fill="rgba(236,253,245,0.8)" />
        </g>
      );
  }
}

export function MediaTipo({ tipo, nombre }: { tipo: TipoCriatura; nombre: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${FONDO[tipo]}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* curvas de nivel */}
        <g fill="none" stroke="rgba(236,253,245,0.07)" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M-10 ${30 + i * 28} C 50 ${10 + i * 28}, 110 ${60 + i * 28}, 210 ${25 + i * 28}`} />
          ))}
        </g>
        <Emblema tipo={tipo} />
      </svg>
      <span className="texto-contorno absolute -bottom-6 -right-2 select-none font-display text-[9rem] font-black leading-none" aria-hidden="true">
        {nombre.charAt(0).toUpperCase()}
      </span>
      <div className={`absolute inset-0 bg-gradient-to-t ${VELO[tipo]} via-transparent to-transparent`} />
    </div>
  );
}
