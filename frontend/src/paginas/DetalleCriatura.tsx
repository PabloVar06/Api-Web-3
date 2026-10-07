/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";
import { Hero } from "../componentes/Hero";
import { RejillaAnimada } from "../componentes/RejillaAnimada";
import { MediaTipo } from "../componentes/MediaTipo";
import { EstadoBadge, MedidorPeligro, TipoBadge } from "../componentes/Insignias";
import { Cargando, MensajeError, PantallaCentrada, Vacio } from "../componentes/Estados";
import { ETIQUETA_TIPO } from "../componentes/etiquetas";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando)
    return (
      <PantallaCentrada>
        <Cargando texto="Cargando ficha" />
      </PantallaCentrada>
    );
  if (error)
    return (
      <PantallaCentrada>
        <div className="w-full space-y-6">
          <MensajeError texto={`Error: ${error}`} />
          <div className="flex justify-center">
            <Link to="/" className="btn-contorno">
              Volver a la lista
            </Link>
          </div>
        </div>
      </PantallaCentrada>
    );
  if (!criatura)
    return (
      <PantallaCentrada>
        <Vacio titulo="No se encontró la criatura">
          <Link to="/" className="btn-contorno">
            Volver a la lista
          </Link>
        </Vacio>
      </PantallaCentrada>
    );

  return (
    <div>
      <Hero
        compacto
        palabraFondo={ETIQUETA_TIPO[criatura.tipo]}
        sobretitulo="Ficha de criatura"
        titulo={criatura.nombre}
      >
        <Link data-accion to="/" className="btn-contorno">
          Volver a la lista
        </Link>
        <Link data-accion to={`/criaturas/${criatura._id}/editar`} className="btn-menta">
          Editar
        </Link>
        <button data-accion type="button" onClick={manejarEliminar} className="btn-peligro">
          Eliminar
        </button>
      </Hero>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-28 lg:grid-cols-5 lg:px-10">
        {/* Datos de la criatura */}
        <section className="vidrio self-start rounded-3xl p-8 lg:col-span-2" aria-label="Datos de la criatura">
          <div className="-mx-8 -mt-8 mb-8 aspect-[16/9] overflow-hidden rounded-t-3xl">
            <MediaTipo tipo={criatura.tipo} nombre={criatura.nombre} />
          </div>

          <dl className="space-y-6">
            <div>
              <dt className="etiqueta-campo">Tipo</dt>
              <dd>
                <TipoBadge tipo={criatura.tipo} />
              </dd>
            </div>
            <div>
              <dt className="etiqueta-campo">Estado</dt>
              <dd>
                <EstadoBadge estado={criatura.estado} />
              </dd>
            </div>
            <div>
              <dt className="etiqueta-campo">Nivel de peligro</dt>
              <dd>
                <MedidorPeligro nivel={criatura.nivelPeligro} />
              </dd>
            </div>
            <div>
              <dt className="etiqueta-campo">Habilidades</dt>
              <dd>
                {criatura.habilidades.length === 0 ? (
                  <span className="text-sm text-stone-500">(ninguna registrada)</span>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {criatura.habilidades.map((h) => (
                      <li key={h} className="rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-200">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Avistamientos */}
        <section className="lg:col-span-3" aria-labelledby="titulo-avistamientos">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="titulo-avistamientos" className="font-display text-3xl font-black uppercase tracking-wider text-stone-50">
              Avistamientos registrados
            </h2>
            <Link to={`/avistamientos/nuevo?criaturaId=${criatura._id}`} className="btn-cobre">
              Registrar un avistamiento de esta criatura
            </Link>
          </div>

          {avistamientos.length === 0 ? (
            <Vacio titulo="Todavía no hay avistamientos registrados para esta criatura" />
          ) : (
            <RejillaAnimada>
              <ol className="relative space-y-5 border-l border-emerald-500/25 pl-8">
                {avistamientos.map((avistamiento) => (
                  <li key={avistamiento._id} data-tarjeta className="relative">
                    <span className="absolute -left-[2.45rem] top-6 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
                    <div className="vidrio rounded-2xl p-5 transition hover:border-emerald-400/50">
                      <time dateTime={avistamiento.fecha.slice(0, 10)} className="text-xs font-semibold uppercase tracking-widest text-amber-200">
                        {avistamiento.fecha.slice(0, 10)}
                      </time>
                      <p className="mt-2 text-stone-100">
                        {avistamiento.testigo} <span className="text-stone-500">en</span> <span className="text-emerald-300">{avistamiento.ubicacion}</span>
                      </p>
                      {avistamiento.descripcion && <p className="mt-2 text-sm text-stone-400">{avistamiento.descripcion}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </RejillaAnimada>
          )}
        </section>
      </div>
    </div>
  );
}
