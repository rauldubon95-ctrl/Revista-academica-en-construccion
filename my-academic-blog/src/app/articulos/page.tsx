import Link from "next/link";
import { getAllPosts } from "@/lib/api";

// Definimos la estructura del Post
type Post = {
  slug: string;
  title: string;
  date: string;
  author: { name: string };
  section: string;
  issue?: string;
  type?: string;
};

// Función auxiliar para agrupar artículos por "Número"
function groupPostsByIssue(posts: Post[]) {
  const groups: Record<string, Post[]> = {};
  
  posts.forEach((post) => {
    // Si el artículo no tiene número, lo ponemos en "En Edición"
    const issueName = post.issue || "Artículos en Edición / Publicación Continua";
    
    if (!groups[issueName]) {
      groups[issueName] = [];
    }
    groups[issueName].push(post);
  });

  // Convertimos el objeto en un array para poder ordenarlo si quisiéramos
  return Object.entries(groups);
}

export default function ArticulosPage() {
  // 1. Obtenemos todos los datos necesarios
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "excerpt",
    "author",
    "section",
    "type",
    "issue", // IMPORTANTE: Este campo es el que usa para agrupar
  ]);

  // 2. Ejecutamos el agrupamiento
  const issues = groupPostsByIssue(posts as unknown as Post[]);

  return (
    <section className="space-y-12 pb-16">
      
      {/* HEADER DE LA SECCIÓN */}
      <header className="space-y-4 border-b pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Archivo de Números
        </h1>
        <p className="text-lg text-zinc-600 max-w-3xl leading-relaxed">
          Colección completa de las publicaciones de <span className="font-semibold text-zinc-900">Cuadernos Abiertos</span>, 
          organizada por volumen y número semestral.
        </p>
      </header>

      {/* LISTA DE NÚMEROS (VOLÚMENES) */}
      <div className="space-y-16">
        {issues.map(([issueName, issuePosts]) => (
          <div key={issueName} className="relative">
            
            {/* CABECERA DEL NÚMERO (Como una portada virtual) */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2">
                  Número Publicado
                </div>
                <h2 className="text-3xl font-serif font-medium text-zinc-900">
                  {issueName}
                </h2>
                <div className="text-zinc-500 mt-2 text-sm">
                  {issuePosts.length} documentos indexados en este número.
                </div>
              </div>
              
              {/* Botón decorativo o de descarga del número completo (futuro) */}
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 border border-zinc-200">
                  Estado: Publicado
                </span>
              </div>
            </div>

            {/* TABLA DE CONTENIDOS DEL NÚMERO */}
            <div className="grid gap-4 border-l-2 border-zinc-100 pl-4 md:pl-8">
              {issuePosts.map((p) => (
                <article key={p.slug} className="group relative flex flex-col items-start justify-between rounded-xl p-4 hover:bg-zinc-50 transition-colors">
                  
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={p.date} className="text-zinc-500">
                      {p.date}
                    </time>
                    {p.section && (
                      <span className="relative z-10 rounded-full bg-zinc-100 px-3 py-1.5 font-medium text-zinc-600">
                        {p.section}
                      </span>
                    )}
                  </div>

                  <div className="group relative max-w-2xl mt-3">
                    <h3 className="text-lg font-semibold leading-6 text-zinc-900 group-hover:text-blue-700 transition-colors">
                      <Link href={`/posts/${p.slug}`}>
                        <span className="absolute inset-0" />
                        {p.title}
                      </Link>
                    </h3>
                    
                    {/* Autor */}
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                       {p.author?.name || "Autor Institucional"}
                    </p>
                  </div>
                  
                  {/* Tipo de documento (Ensayo, Artículo, etc.) */}
                  {p.type && (
                     <div className="mt-2 text-xs text-zinc-400 font-mono uppercase">
                        [{p.type}]
                     </div>
                  )}

                </article>
              ))}
            </div>
            
            {/* Separador visual entre números */}
            <div className="w-full h-px bg-zinc-200 mt-12" />
          </div>
        ))}
      </div>

      {issues.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
          <p className="text-zinc-500">No hay números publicados todavía.</p>
        </div>
      )}

    </section>
  );
}