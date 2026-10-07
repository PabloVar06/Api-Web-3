import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const ENLACES = [
  { a: "/", etiqueta: "Criaturas", fin: true },
  { a: "/avistamientos", etiqueta: "Avistamientos", fin: false },
];

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Pawnee Creature Tracker, inicio">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-emerald-400/50 bg-emerald-400/10 shadow-luz transition group-hover:bg-emerald-400/25">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 3 5 14h4l-3 6h12l-3-6h4L12 3Z" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-sm font-black uppercase tracking-[0.25em] text-stone-100">Pawnee</span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [desplazado, setDesplazado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    const alScroll = () => setDesplazado(window.scrollY > 40);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
    setMenuAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
    return () => window.clearTimeout(t);
  }, [hash, search, pathname]);

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const termino = busqueda.trim();
    navigate(termino ? `/?q=${encodeURIComponent(termino)}#criaturas` : "/#criaturas");
    setMenuAbierto(false);
  }

  const claseEnlace = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-light tracking-wide transition hover:text-emerald-300 ${isActive ? "text-emerald-300" : "text-stone-300"}`;

  const formulario = (
    <form onSubmit={buscar} role="search" className="relative">
      <label htmlFor="busqueda-rapida" className="sr-only">
        Buscar criatura por nombre
      </label>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id="busqueda-rapida"
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar criatura"
        className="w-full rounded-full border border-emerald-500/20 bg-black/30 py-2 pl-10 pr-4 text-sm font-light text-stone-100 placeholder-stone-500 backdrop-blur transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 md:w-52 md:focus:w-64"
      />
    </form>
  );

  return (
    <div className="relative">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-emerald-950">
        Saltar al contenido
      </a>

      <nav
        aria-label="Principal"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          desplazado || menuAbierto ? "border-b border-emerald-500/15 bg-emerald-950/70 py-3 backdrop-blur-lg" : "border-b border-transparent bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            {ENLACES.map((e) => (
              <NavLink key={e.a} to={e.a} end={e.fin} className={claseEnlace}>
                {e.etiqueta}
              </NavLink>
            ))}
            {formulario}
            <Link to="/criaturas/nueva" className="btn-cobre !px-5 !py-2.5">
              Registrar criatura
            </Link>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-emerald-500/30 text-stone-200 md:hidden"
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {menuAbierto ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        {menuAbierto && (
          <div id="menu-movil" className="mx-auto mt-4 flex max-w-7xl flex-col gap-5 px-6 pb-5 md:hidden">
            {ENLACES.map((e) => (
              <NavLink key={e.a} to={e.a} end={e.fin} className={claseEnlace}>
                {e.etiqueta}
              </NavLink>
            ))}
            {formulario}
            <Link to="/criaturas/nueva" className="btn-cobre">
              Registrar criatura
            </Link>
          </div>
        )}
      </nav>

      <main id="contenido">{children}</main>

      <footer className="border-t border-emerald-500/10 px-6 py-10 text-center text-xs tracking-widest text-stone-500">
        Departamento de Pawnee · Monitoreo de criaturas y avistamientos
      </footer>
    </div>
  );
}
