/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";
import { Hero } from "../componentes/Hero";
import { Cargando, MensajeError, PantallaCentrada } from "../componentes/Estados";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando)
    return (
      <PantallaCentrada>
        <Cargando texto="Cargando formulario" />
      </PantallaCentrada>
    );

  return (
    <div>
      <Hero mini palabraFondo="Huella" sobretitulo="Bitácora de expedición" titulo="Registrar avistamiento" />

      <section className="relative z-10 mx-auto -mt-16 max-w-2xl px-6 pb-28">
        <div className="vidrio rounded-3xl p-8 shadow-2xl md:p-10">
          {error && (
            <div className="mb-8">
              <MensajeError texto={error} />
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-7">
            <div>
              <label htmlFor="criatura" className="etiqueta-campo">
                Criatura
              </label>
              <select
                id="criatura"
                className="campo"
                value={form.criatura}
                onChange={(e) => setForm({ ...form, criatura: e.target.value })}
              >
                {criaturas.map((criatura) => (
                  <option key={criatura._id} value={criatura._id}>
                    {criatura.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="testigo" className="etiqueta-campo">
                  Testigo
                </label>
                <input
                  id="testigo"
                  type="text"
                  className="campo"
                  value={form.testigo}
                  onChange={(e) => setForm({ ...form, testigo: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="fecha" className="etiqueta-campo">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  className="campo [color-scheme:dark]"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ubicacion" className="etiqueta-campo">
                Ubicación
              </label>
              <input
                id="ubicacion"
                type="text"
                className="campo"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="etiqueta-campo">
                Descripción (opcional)
              </label>
              <input
                id="descripcion"
                type="text"
                className="campo"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="submit" disabled={guardando} className="btn-cobre">
                {guardando ? "Guardando..." : "Registrar avistamiento"}
              </button>
              <Link to="/avistamientos" className="btn-contorno">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
