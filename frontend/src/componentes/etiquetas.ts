/**
 * etiquetas.ts
 * ------------
 * Solo presentación: textos legibles para los valores internos de los tipos.
 * No modifica ni reemplaza los valores que viajan al backend.
 */
import { EstadoInvestigacion, TipoCriatura } from "../tipos";

export const ETIQUETA_TIPO: Record<TipoCriatura, string> = {
  mitica: "Mítica",
  elemental: "Elemental",
  mecanica: "Mecánica",
  espectral: "Espectral",
};

export const ETIQUETA_ESTADO: Record<EstadoInvestigacion, string> = {
  activa: "Activa",
  en_investigacion: "En investigación",
  descartada: "Descartada",
};

export const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
