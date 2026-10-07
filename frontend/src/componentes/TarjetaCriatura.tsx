import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Criatura } from "../tipos";
import { EstadoBadge, MedidorPeligro } from "./Insignias";
import { MediaTipo } from "./MediaTipo";
import { ETIQUETA_TIPO } from "./etiquetas";

export function TarjetaCriatura({ criatura }: { criatura: Criatura }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = raiz.current;
      if (!el || !contextSafe) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-revelar]", { y: 16, opacity: 0 });

        const entrar = contextSafe(() => {
          gsap.to(el.querySelector("[data-elevar]"), { y: -8, duration: 0.45, ease: "power2.out" });
          gsap.to(el.querySelector("[data-imagen]"), { scale: 1.08, duration: 0.8, ease: "power2.out" });
          gsap.to("[data-revelar]", { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out", overwrite: true });
        });
        const salir = contextSafe(() => {
          gsap.to(el.querySelector("[data-elevar]"), { y: 0, duration: 0.5, ease: "power2.out" });
          gsap.to(el.querySelector("[data-imagen]"), { scale: 1, duration: 0.8, ease: "power2.out" });
          gsap.to("[data-revelar]", { y: 16, opacity: 0, duration: 0.25, overwrite: true });
        });

        el.addEventListener("mouseenter", entrar);
        el.addEventListener("mouseleave", salir);
        el.addEventListener("focusin", entrar);
        el.addEventListener("focusout", salir);
        return () => {
          el.removeEventListener("mouseenter", entrar);
          el.removeEventListener("mouseleave", salir);
          el.removeEventListener("focusin", entrar);
          el.removeEventListener("focusout", salir);
        };
      });

      // Sin movimiento reducido: dejar las acciones siempre visibles
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} data-tarjeta>
      <article
        data-elevar
        className="vidrio group flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-emerald-400/50"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link to={`/criaturas/${criatura._id}`} aria-label={`Ver ficha de ${criatura.nombre}`} className="block h-full w-full">
            <div data-imagen className="h-full w-full">
              <MediaTipo tipo={criatura.tipo} nombre={criatura.nombre} />
            </div>
          </Link>

          <div className="pointer-events-none absolute left-4 top-4">
            <EstadoBadge estado={criatura.estado} />
          </div>

          {/* Acciones reveladas al pasar el cursor o enfocar */}
          <div className="absolute inset-x-4 bottom-4 flex gap-2">
            <Link data-revelar to={`/criaturas/${criatura._id}`} className="btn-menta flex-1 !px-4 !py-2.5">
              Ver ficha
            </Link>
            <Link data-revelar to={`/criaturas/${criatura._id}/editar`} className="btn-contorno !bg-black/40 !px-4 !py-2.5 backdrop-blur">
              Editar
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/80">{ETIQUETA_TIPO[criatura.tipo]}</p>
            <h3 className="mt-1 font-display text-2xl font-black uppercase leading-tight tracking-wider text-stone-50">
              <Link to={`/criaturas/${criatura._id}`} className="transition hover:text-emerald-300">
                {criatura.nombre}
              </Link>
            </h3>
          </div>

          <MedidorPeligro nivel={criatura.nivelPeligro} />

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1" aria-label="Habilidades">
            {criatura.habilidades.length === 0 ? (
              <li className="text-xs text-stone-500">(ninguna registrada)</li>
            ) : (
              criatura.habilidades.slice(0, 3).map((h) => (
                <li key={h} className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-200">
                  {h}
                </li>
              ))
            )}
            {criatura.habilidades.length > 3 && <li className="px-1 py-1 text-[11px] text-stone-400">+{criatura.habilidades.length - 3}</li>}
          </ul>
        </div>
      </article>
    </div>
  );
}
