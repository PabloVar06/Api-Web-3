import { ElementType } from "react";

/**
 * Divide un texto en letras (o palabras) para que GSAP las anime.
 * Cada pieza lleva `data-pieza`; el Hero hace la animación.
 */
export function TextoAnimado({
  texto,
  por = "letra",
  as: Etiqueta = "span",
  className = "",
}: {
  texto: string;
  por?: "letra" | "palabra";
  as?: ElementType;
  className?: string;
}) {
  const palabras = texto.split(" ");
  return (
    <Etiqueta className={className} aria-label={texto}>
      {palabras.map((palabra, i) => (
        <span key={i} aria-hidden="true" className="inline-block whitespace-nowrap">
          {por === "palabra" ? (
            <span data-pieza className="inline-block">
              {palabra}
            </span>
          ) : (
            palabra.split("").map((letra, j) => (
              <span key={j} data-pieza className="inline-block">
                {letra}
              </span>
            ))
          )}
          {i < palabras.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Etiqueta>
  );
}
