import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/** Número que cuenta desde su valor anterior hasta `valor`. */
export function Contador({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const actual = useRef({ n: 0 });

  useGSAP(
    () => {
      const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducir) {
        actual.current.n = valor;
        if (ref.current) ref.current.textContent = String(valor);
        return;
      }
      gsap.to(actual.current, {
        n: valor,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(actual.current.n));
        },
      });
    },
    { dependencies: [valor] }
  );

  return (
    <span ref={ref} aria-label={String(valor)}>
      0
    </span>
  );
}
