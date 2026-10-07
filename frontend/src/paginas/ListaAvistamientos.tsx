/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";
import { Hero } from "../componentes/Hero";
import { Contador } from "../componentes/Contador";
import { RejillaAnimada } from "../componentes/RejillaAnimada";
import { Cargando, MensajeError, Vacio } from "../componentes/Estados";
import { MESES } from "../componentes/etiquetas";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  // Solo presentación: cifras derivadas de la lista ya cargada.
  const criaturasDistintas = new Set(avistamientos.map((a) => a.criatura._id)).size;
  const lugaresDistintos = new Set(avistamientos.map((a) => a.ubicacion.trim().toLowerCase())).size;

  return (
    <div>
      <Hero
        compacto
        palabraFondo="Huellas"
        sobretitulo="Bitácora de expedición"
        titulo="Avistamientos registrados"
        subtitulo="Cada testigo, cada lugar, cada fecha: el rastro de las criaturas de Pawnee."
        pie={
          <dl className="grid max-w-2xl grid-cols-3 gap-4">
            {[
              ["Avistamientos", avistamientos.length],
              ["Criaturas distintas", criaturasDistintas],
              ["Lugares", lugaresDistintos],
            ].map(([etiqueta, valor]) => (
              <div key={etiqueta} className="vidrio rounded-2xl px-4 py-4 md:px-6">
                <dd className="font-display text-4xl font-black text-emerald-300 md:text-5xl">
                  <Contador valor={Number(valor)} />
                </dd>
                <dt className="mt-1 text-xs text-stone-400">{etiqueta}</dt>
              </div>
            ))}
          </dl>
        }
      >
        <Link data-accion to="/avistamientos/nuevo" className="btn-cobre">
          Registrar avistamiento
        </Link>
        <Link data-accion to="/" className="btn-contorno">
          Volver a criaturas
        </Link>
      </Hero>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        {cargando && <Cargando texto="Cargando avistamientos" />}
        {!cargando && error && <MensajeError texto={`Error: ${error}`} />}
        {!cargando && !error && avistamientos.length === 0 && (
          <Vacio titulo="Todavía no hay avistamientos registrados">
            <Link to="/avistamientos/nuevo" className="btn-cobre">
              Registrar el primero
            </Link>
          </Vacio>
        )}

        {!cargando && !error && avistamientos.length > 0 && (
          <RejillaAnimada className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {avistamientos.map((avistamiento) => {
              const [anio, mes, dia] = avistamiento.fecha.slice(0, 10).split("-");
              return (
                <div key={avistamiento._id} data-tarjeta>
                  <article className="vidrio group flex h-full flex-col rounded-3xl p-6 transition duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:shadow-luz">
                    <div className="flex items-start gap-5">
                      <time
                        dateTime={avistamiento.fecha.slice(0, 10)}
                        className="flex w-16 shrink-0 flex-col items-center rounded-2xl border border-amber-200/20 bg-amber-200/5 py-3 text-amber-100"
                      >
                        <span className="font-display text-3xl font-black leading-none">{dia}</span>
                        <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest">{MESES[Number(mes) - 1] ?? mes}</span>
                        <span className="text-[10px] text-amber-200/60">{anio}</span>
                      </time>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-black uppercase leading-tight tracking-wider text-stone-50">
                          <Link to={`/criaturas/${avistamiento.criatura._id}`} className="transition hover:text-emerald-300">
                            {avistamiento.criatura.nombre}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-stone-300">
                          Visto por <span className="text-amber-200">{avistamiento.testigo}</span>
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {avistamiento.ubicacion}
                    </p>

                    {avistamiento.descripcion && <p className="mt-3 text-sm leading-relaxed text-stone-400">{avistamiento.descripcion}</p>}

                    <div className="mt-auto flex items-center justify-between pt-6">
                      <Link to={`/criaturas/${avistamiento.criatura._id}`} className="text-xs font-bold uppercase tracking-widest text-amber-200 transition hover:text-amber-100">
                        Ver criatura
                      </Link>
                      <button type="button" onClick={() => manejarEliminar(avistamiento._id)} className="btn-peligro !px-4 !py-2">
                        Eliminar
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </RejillaAnimada>
        )}
      </section>
    </div>
  );
}
