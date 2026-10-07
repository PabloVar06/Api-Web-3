/**
 * paginas/FormularioCriatura.tsx
 * ----------------------------------
 * Un solo componente para CREAR y EDITAR, según la ruta.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";
import { Hero } from "../componentes/Hero";
import { MedidorPeligro } from "../componentes/Insignias";
import { Cargando, MensajeError, PantallaCentrada } from "../componentes/Estados";
import { ETIQUETA_ESTADO, ETIQUETA_TIPO } from "../componentes/etiquetas";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando)
    return (
      <PantallaCentrada>
        <Cargando texto="Cargando datos de la criatura" />
      </PantallaCentrada>
    );

  return (
    <div>
      <Hero mini palabraFondo={esEdicion ? "Editar" : "Nueva"} sobretitulo="Ficha de criatura" titulo={esEdicion ? "Editar criatura" : "Registrar criatura nueva"} />

      <section className="relative z-10 mx-auto -mt-16 max-w-2xl px-6 pb-28">
        <div className="vidrio rounded-3xl p-8 shadow-2xl md:p-10">
          {error && (
            <div className="mb-8">
              <MensajeError texto={error} />
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-7">
            <div>
              <label htmlFor="nombre" className="etiqueta-campo">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                className="campo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="tipo" className="etiqueta-campo">
                  Tipo
                </label>
                <select
                  id="tipo"
                  className="campo"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
                >
                  {TIPOS_CRIATURA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {ETIQUETA_TIPO[tipo]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estado" className="etiqueta-campo">
                  Estado
                </label>
                <select
                  id="estado"
                  className="campo"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
                >
                  {ESTADOS_INVESTIGACION.map((estado) => (
                    <option key={estado} value={estado}>
                      {ETIQUETA_ESTADO[estado]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="habilidades" className="etiqueta-campo">
                Habilidades (separadas por comas)
              </label>
              <input
                id="habilidades"
                type="text"
                className="campo"
                value={habilidadesTexto}
                onChange={(e) => setHabilidadesTexto(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="nivelPeligro" className="etiqueta-campo">
                Nivel de peligro (1-10)
              </label>
              <input
                id="nivelPeligro"
                type="number"
                min={1}
                max={10}
                className="campo"
                value={form.nivelPeligro}
                onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
              />
              <div className="mt-3">
                <MedidorPeligro nivel={Math.min(10, Math.max(0, form.nivelPeligro || 0))} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="submit" disabled={guardando} className="btn-cobre">
                {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
              </button>
              <Link to={esEdicion && id ? `/criaturas/${id}` : "/"} className="btn-contorno">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
