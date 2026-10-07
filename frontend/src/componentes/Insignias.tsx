import { EstadoInvestigacion, TipoCriatura } from "../tipos";
import { ETIQUETA_ESTADO, ETIQUETA_TIPO } from "./etiquetas";

const ESTILO_ESTADO: Record<EstadoInvestigacion, { punto: string; caja: string }> = {
  activa: { punto: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]", caja: "border-emerald-400/40 text-emerald-300" },
  en_investigacion: { punto: "bg-amber-300 shadow-[0_0_8px_2px_rgba(252,211,77,0.55)]", caja: "border-amber-300/40 text-amber-200" },
  descartada: { punto: "bg-stone-500", caja: "border-stone-500/40 text-stone-400" },
};

export function EstadoBadge({ estado }: { estado: EstadoInvestigacion }) {
  const e = ESTILO_ESTADO[estado];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur ${e.caja}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${e.punto}`} />
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}

export function TipoBadge({ tipo }: { tipo: TipoCriatura }) {
  return (
    <span className="inline-flex rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-200">
      {ETIQUETA_TIPO[tipo]}
    </span>
  );
}

/** Medidor de 10 segmentos para nivelPeligro (1-10). */
export function MedidorPeligro({ nivel }: { nivel: number }) {
  const color = nivel <= 3 ? "bg-emerald-400" : nivel <= 6 ? "bg-amber-300" : "bg-orange-600";
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`Nivel de peligro ${nivel} de 10`}>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-1.5 w-2.5 rounded-full ${i < nivel ? color : "bg-white/10"}`} />
        ))}
      </div>
      <span className="font-display text-sm font-black text-stone-100">{nivel}/10</span>
    </div>
  );
}
