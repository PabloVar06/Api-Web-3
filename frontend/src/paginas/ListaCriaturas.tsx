/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas en una rejilla de
 * tarjetas. Maneja los 3 estados: loading, error y empty.
 */

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";
import { Hero } from "../componentes/Hero";
import { Contador } from "../componentes/Contador";
import { RejillaAnimada } from "../componentes/RejillaAnimada";
import { TarjetaCriatura } from "../componentes/TarjetaCriatura";
import { Cargando, MensajeError, Vacio } from "../componentes/Estados";
import { ETIQUETA_TIPO } from "../componentes/etiquetas";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  // Solo presentación: búsqueda rápida del navbar (?q=) y cifras derivadas de la lista ya cargada.
  const [parametros] = useSearchParams();
  const busqueda = (parametros.get("q") ?? "").trim().toLowerCase();
  const visibles = busqueda ? criaturas.filter((c) => c.nombre.toLowerCase().includes(busqueda)) : criaturas;
  const totalActivas = criaturas.filter((c) => c.estado === "activa").length;
  const peligroMaximo = criaturas.reduce((max, c) => Math.max(max, c.nivelPeligro), 0);

  const opcionesFiltro: (TipoCriatura | "")[] = ["", ...TIPOS_CRIATURA];

  return (
    <div>
      <Hero
        palabraFondo="Pawnee"
        sobretitulo="Monitoreo de criaturas y expediciones"
        titulo="Pawnee Creature Tracker"
        subtitulo="Registra, clasifica y sigue a cada criatura que ronda los bosques de Pawnee. Cada avistamiento deja una huella."
        pie={
          <div className="flex flex-col items-start gap-8">
            <dl className="grid w-full max-w-2xl grid-cols-3 gap-4">
              {[
                ["Criaturas listadas", criaturas.length],
                ["Con estado activo", totalActivas],
                ["Peligro máximo", peligroMaximo],
              ].map(([etiqueta, valor]) => (
                <div key={etiqueta} className="vidrio rounded-2xl px-4 py-4 md:px-6">
                  <dd className="font-display text-4xl font-black text-emerald-300 md:text-5xl">
                    <Contador valor={Number(valor)} />
                  </dd>
                  <dt className="mt-1 text-xs text-stone-400">{etiqueta}</dt>
                </div>
              ))}
            </dl>
            <Link to="/criaturas/nueva" className="btn-cobre">
              Registrar criatura
            </Link>
          </div>
        }
      >
        <a data-accion href="#criaturas" className="btn-menta">
          Explorar criaturas
        </a>
        <Link data-accion to="/avistamientos" className="btn-contorno">
          Ver avistamientos
        </Link>
      </Hero>

      <section id="criaturas" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-28 lg:px-10">
        {/* Filtro flotante en pills */}
        <div className="sticky top-20 z-30 mb-10 flex justify-center">
          <div
            role="group"
            aria-label="Filtrar por tipo"
            className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-emerald-500/20 bg-emerald-950/60 p-1.5 shadow-2xl backdrop-blur-md"
          >
            {opcionesFiltro.map((valor) => {
              const activo = filtroTipo === valor;
              return (
                <button
                  key={valor || "todos"}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setFiltroTipo(valor)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
                    activo ? "bg-emerald-400 text-emerald-950 shadow-luz" : "text-amber-100/80 hover:bg-amber-200/10 hover:text-amber-100"
                  }`}
                >
                  {valor ? ETIQUETA_TIPO[valor] : "Todos los tipos"}
                </button>
              );
            })}
          </div>
        </div>

        {busqueda && (
          <p className="mb-8 text-center text-sm text-stone-400">
            Resultados para <span className="text-amber-200">“{parametros.get("q")}”</span> ·{" "}
            <Link to="/#criaturas" className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
              Quitar búsqueda
            </Link>
          </p>
        )}

        {cargando && <Cargando texto="Rastreando criaturas" />}
        {!cargando && error && <MensajeError texto={`Ocurrió un error: ${error}`} />}
        {!cargando && !error && criaturas.length === 0 && (
          <Vacio titulo="Todavía no hay criaturas registradas">
            <Link to="/criaturas/nueva" className="btn-cobre">
              Registrar la primera criatura
            </Link>
          </Vacio>
        )}
        {!cargando && !error && criaturas.length > 0 && visibles.length === 0 && (
          <Vacio titulo="Ninguna criatura coincide con tu búsqueda">
            <Link to="/#criaturas" className="btn-contorno">
              Ver todas
            </Link>
          </Vacio>
        )}

        {!cargando && !error && visibles.length > 0 && (
          <RejillaAnimada className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibles.map((criatura) => (
              <TarjetaCriatura key={criatura._id} criatura={criatura} />
            ))}
          </RejillaAnimada>
        )}
      </section>
    </div>
  );
}
