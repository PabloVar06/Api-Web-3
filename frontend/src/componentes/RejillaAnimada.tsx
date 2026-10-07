import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Rejilla cuyos hijos con `data-tarjeta` entran escalonados al llegar al viewport.
 * Se monta cada vez que la lista se renderiza, así que anima tras cada carga/filtro.
 */
export function RejillaAnimada({ children, className = "" }: { children: ReactNode; className?: string }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tarjetas = gsap.utils.toArray<HTMLElement>("[data-tarjeta]");
        if (tarjetas.length === 0) return;
        gsap.set(tarjetas, { y: 50, opacity: 0 });
        ScrollTrigger.batch(tarjetas, {
          start: "top 90%",
          once: true,
          onEnter: (lote) =>
            gsap.to(lote, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
        });
      });
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
