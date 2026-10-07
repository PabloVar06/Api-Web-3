import { ReactNode } from "react";

export function Cargando({ texto }: { texto: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-24 text-sm uppercase tracking-widest text-emerald-300" role="status">
      <span className="h-3 w-3 animate-ping rounded-full bg-emerald-400" />
      {texto}
    </div>
  );
}

export function MensajeError({ texto }: { texto: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-orange-700/50 bg-orange-950/40 px-5 py-4 text-sm text-orange-200 backdrop-blur">
      {texto}
    </div>
  );
}

export function Vacio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="vidrio mx-auto max-w-xl rounded-3xl px-8 py-16 text-center">
      <p className="font-display text-2xl font-black uppercase tracking-wider text-stone-100">{titulo}</p>
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </div>
  );
}

/** Pantalla completa para estados de página (cargando / error) en vistas sin hero. */
export function PantallaCentrada({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 pt-24">{children}</div>;
}
