import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextoAnimado } from "./TextoAnimado";

interface HeroProps {
  /** Palabra gigante en contorno, detrás del título (tipografía en capas). */
  palabraFondo: string;
  titulo: string;
  subtitulo?: string;
  /** Texto pequeño sobre el título. */
  sobretitulo?: string;
  /** Botones de acción. */
  children?: ReactNode;
  /** Estadísticas o indicadores bajo los botones. */
  pie?: ReactNode;
  compacto?: boolean;
  /** Cabecera baja para formularios. */
  mini?: boolean;
}

// Posiciones fijas de luciérnagas (x%, y%, tamaño px)
const LUCIERNAGAS = [
  [8, 30, 3], [15, 62, 2], [24, 22, 2], [33, 48, 3], [41, 18, 2], [52, 58, 3], [61, 28, 2],
  [69, 52, 3], [77, 20, 2], [84, 44, 3], [91, 26, 2], [95, 60, 2], [47, 36, 2], [28, 70, 2],
];

// Pinos generados de forma determinista (sin Math.random en render)
const PINOS = Array.from({ length: 46 }, (_, i) => {
  const x = i * 32 + ((i * 53) % 17);
  const alto = 70 + ((i * 37) % 55);
  const ancho = alto * 0.42;
  return { x, alto, ancho };
});

function Paisaje() {
  return (
    <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[55%] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cresta1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#065f46" stopOpacity="0.55" />
          <stop offset="1" stopColor="#022c22" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path data-cresta="1" fill="url(#cresta1)" d="M0 250 C120 180 220 210 340 160 C470 105 560 190 690 150 C820 110 940 190 1070 140 C1200 90 1320 170 1440 130 L1440 420 L0 420Z" />
      <path data-cresta="2" fill="#03231b" fillOpacity="0.92" d="M0 300 C140 250 250 290 390 240 C520 195 640 270 780 235 C920 200 1030 270 1170 225 C1290 188 1380 240 1440 220 L1440 420 L0 420Z" />
      <g data-cresta="3" fill="#021510">
        <path d="M0 360 C180 330 320 350 520 325 C720 300 900 350 1100 322 C1260 300 1360 335 1440 320 L1440 420 L0 420Z" />
        {PINOS.map((p, i) => (
          <polygon
            key={i}
            points={`${p.x},${380 - p.alto} ${p.x + p.ancho},${390} ${p.x - p.ancho},${390}`}
            opacity={0.9}
          />
        ))}
      </g>
    </svg>
  );
}

export function Hero({ palabraFondo, titulo, subtitulo, sobretitulo, children, pie, compacto = false, mini = false }: HeroProps) {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-fondo-palabra]", { opacity: 0, scale: 1.08, duration: 1.6 })
          .from("[data-sobretitulo]", { opacity: 0, y: 12, duration: 0.7 }, 0.2)
          .from("[data-pieza]", { y: 30, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.35)
          .from("[data-subtitulo]", { opacity: 0, y: 16, duration: 0.9 }, ">-0.2")
          .from("[data-accion]", { opacity: 0, y: 14, duration: 0.7, stagger: 0.12 }, ">-0.5")
          .from("[data-pie]", { opacity: 0, y: 14, duration: 0.8 }, ">-0.4");

        gsap.from("[data-cresta]", { y: 60, opacity: 0, duration: 1.6, stagger: 0.18, ease: "power2.out" });

        gsap.utils.toArray<HTMLElement>("[data-luciernaga]").forEach((el, i) => {
          gsap.to(el, {
            x: gsap.utils.random(-30, 30),
            y: gsap.utils.random(-40, 20),
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.15,
          });
          gsap.to(el, { opacity: 0.15, duration: gsap.utils.random(1.2, 2.6), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2 });
        });
      });
    },
    { scope: raiz }
  );

  return (
    <header
      ref={raiz}
      className={`relative isolate flex flex-col justify-center overflow-hidden ${mini ? "min-h-[36vh] pt-28 pb-24" : compacto ? "min-h-[56vh] pt-28 pb-16" : "min-h-screen pt-28 pb-24"}`}
    >
      {/* Fondo: resplandor + paisaje + luciérnagas */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(20,184,166,0.28),transparent_55%),radial-gradient(ellipse_at_10%_80%,rgba(6,95,70,0.5),transparent_60%)]" />
      <Paisaje />
      <div className="absolute inset-0 -z-10">
        {LUCIERNAGAS.map(([x, y, t], i) => (
          <span
            key={i}
            data-luciernaga
            className="absolute rounded-full bg-emerald-200 shadow-[0_0_12px_3px_rgba(110,231,183,0.8)]"
            style={{ left: `${x}%`, top: `${y}%`, width: t, height: t }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/70 via-transparent to-zinc-950" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        {/* Palabra gigante en contorno, detrás */}
        <p
          data-fondo-palabra
          aria-hidden="true"
          className="texto-contorno pointer-events-none absolute -top-6 left-4 select-none whitespace-nowrap font-display text-[22vw] font-black uppercase leading-none tracking-tighter lg:left-8"
        >
          {palabraFondo}
        </p>

        <div className="relative">
          {sobretitulo && (
            <p data-sobretitulo className="mb-5 text-sm font-medium tracking-wide text-amber-200/90">
              {sobretitulo}
            </p>
          )}

          <h1 className={`font-display font-black uppercase leading-[0.92] tracking-wider text-stone-50 ${mini ? "text-4xl md:text-6xl" : compacto ? "text-5xl md:text-7xl" : "text-6xl md:text-8xl lg:text-[8.5rem]"}`}>
            <TextoAnimado texto={titulo} />
          </h1>

          {subtitulo && (
            <p data-subtitulo className="mt-8 max-w-xl text-lg leading-relaxed text-stone-300/90">
              {subtitulo}
            </p>
          )}

          {children && <div className="mt-10 flex flex-wrap items-center gap-4 [&>*]:will-change-transform">{children}</div>}

          {pie && (
            <div data-pie className="mt-14">
              {pie}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
