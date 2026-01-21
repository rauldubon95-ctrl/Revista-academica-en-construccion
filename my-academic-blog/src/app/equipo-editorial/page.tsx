import Image from "next/image";

// TIPO DE DATOS
type Miembro = {
  name: string;
  role: string;
  area: string;
  affiliation?: string;
  bio: string;
  photo?: string; // ruta en /public
  orcid?: string;
};

type ConsejoCientifico = {
  name: string;
  university: string;
  country: string; // Emoji de bandera o nombre
  area: string;
};

// --- DATOS DEL EQUIPO (TU LISTA ORIGINAL) ---
const equipo: Miembro[] = [
  {
    name: "José Raúl Dubón Huezo",
    role: "Director editorial",
    area: "Sociología • Monitoreo y evaluación • Políticas públicas",
    affiliation: "El Salvador",
    bio:
      "Sociólogo e investigador, con experiencia en diseño de sistemas de monitoreo y evaluación, análisis de políticas públicas y coordinación de proyectos académicos. Su trabajo se orienta a la producción de evidencia social aplicada, con énfasis en rigor metodológico, transparencia y acceso abierto.",
    photo: "/equipo/raul-dubon.jpg",
    orcid: "0009-0007-2398-7927",
  },
  {
    name: "Ariel Quintanilla Magaña",
    role: "Editor asociado",
    area: "Geografía humana • Socioecología • Sistemas territoriales",
    affiliation: "Investigación socioambiental y GIS",
    bio:
      "Geógrafo humano/sociólogo con trayectoria en análisis territorial, sistemas socioecológicos y herramientas de información geográfica (GIS). Interés en gobernanza, justicia ambiental y dinámicas socioambientales en América Latina.",
    photo: "/equipo/ariel-quintanilla.jpg",
    orcid: "0000-0002-4412-8482",
  },
  {
    name: "Jesús Osmán Juárez Artiga",
    role: "Editor asociado",
    area: "Política social • Deporte • Desarrollo • Gestión",
    affiliation: "Programas socio-deportivos y políticas públicas",
    bio:
      "Profesional con experiencia en gestión y seguimiento de programas socio-deportivos, con enfoque en inclusión, trabajo con juventudes y articulación institucional. Su interés se centra en evaluación de intervenciones, gobernanza y modelos de desarrollo con enfoque de derechos.",
    photo: "/equipo/jesus-juarez.jpg",
  },
  {
    name: "Reina de los Ángeles Díaz López",
    role: "Miembro del consejo editorial",
    area: "Antropología sociocultural • Comunidad • Memoria",
    affiliation: "Investigación cualitativa y análisis territorial",
    bio:
      "Antropóloga con experiencia en investigación cualitativa aplicada, trabajo comunitario y análisis sociocultural. Interés en memoria colectiva, identidad, enfoques de género y producción de conocimiento situado.",
    photo: "/equipo/angeles-diaz.jpg",
  },
];

// --- DATOS DEL CONSEJO CIENTÍFICO (NUEVO) ---
const consejoCientifico: ConsejoCientifico[] = [
  {
    name: "Dra. María González",
    university: "Universidad Nacional Autónoma de México (UNAM)",
    country: "🇲🇽 México",
    area: "Sociología Política",
  },
  {
    name: "Dr. Carlos Rossi",
    university: "Universidad de Buenos Aires (UBA)",
    country: "🇦🇷 Argentina",
    area: "Metodología de la Investigación",
  },
  {
    name: "Dra. Elena Smith",
    university: "London School of Economics (LSE)",
    country: "🇬🇧 Reino Unido",
    area: "Desarrollo Internacional",
  },
  // Agrega más aquí...
];

// COMPONENTE BADGE
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-zinc-700 bg-zinc-50">
      {children}
    </span>
  );
}

// PÁGINA PRINCIPAL
export default function EquipoEditorialPage() {
  return (
    <section className="space-y-16 pb-16"> {/* Aumenté el espaciado vertical */}
      
      {/* HEADER */}
      <header className="space-y-4 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Equipo Editorial</h1>
        <p className="text-lg text-zinc-600 max-w-3xl leading-relaxed">
          <span className="font-semibold text-zinc-900">Cuadernos Abiertos</span> es una iniciativa académica 
          comprometida con el rigor científico y la transparencia. A continuación presentamos al cuerpo 
          encargado de la gestión, revisión y dirección estratégica de la revista.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge>Acceso abierto</Badge>
          <Badge>Revisión por pares</Badge>
          <Badge>Transparencia</Badge>
          <Badge>Rigor metodológico</Badge>
        </div>
      </header>

      {/* SECCIÓN 1: EQUIPO EJECUTIVO (FOTOS GRANDES) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 flex items-center gap-2">
          <span className="h-6 w-1 bg-black rounded-full"></span>
          Dirección y Edición
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {equipo.map((m) => (
            <article key={m.name} className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                {/* FOTO */}
                <div className="shrink-0">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-100 shadow-inner">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={`Foto de ${m.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="96px"
                        priority={m.role === "Director editorial"}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-100 text-xs text-zinc-400">
                        Sin foto
                      </div>
                    )}
                  </div>
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900 leading-tight">{m.name}</h3>
                  <div className="text-sm font-medium text-blue-700">{m.role}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide font-semibold mt-1">{m.area}</div>
                  
                  {m.affiliation && (
                    <div className="text-sm text-zinc-600 mt-1 italic">{m.affiliation}</div>
                  )}
                  
                  {m.orcid && (
                    <div className="pt-2">
                      <a href={`https://orcid.org/${m.orcid}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.948.948 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.3 0 5.054 2.067 5.054 5.04 0 3.407-2.373 4.997-5.032 4.997h-3.92V7.416zm1.444 1.303v7.444h2.298c1.663 0 3.434-1.183 3.434-3.665 0-2.38-1.505-3.779-3.468-3.779h-2.264z"/></svg>
                        {m.orcid}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* BIO */}
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <p className="text-sm text-zinc-600 leading-relaxed text-justify">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: CONSEJO CIENTÍFICO (NUEVO) */}
      <div className="space-y-6 pt-8 border-t">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 flex items-center gap-2">
            <span className="h-6 w-1 bg-zinc-400 rounded-full"></span>
            Consejo Científico Internacional
          </h2>
          <p className="text-zinc-600 max-w-3xl">
            Académicos e investigadores externos que asesoran sobre la calidad, pertinencia y dirección
            temática de la revista, garantizando estándares internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consejoCientifico.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="text-2xl select-none" role="img" aria-label={`Bandera de ${c.country}`}>
                {c.country.split(" ")[0]} {/* Muestra solo el emoji */}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{c.name}</h3>
                <div className="text-xs font-medium text-zinc-600">{c.university}</div>
                <div className="text-xs text-blue-600 mt-1">{c.area}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}