import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { auth, signIn, signOut } from "@/auth"; // <--- IMPORTANTE: Importamos la seguridad

function groupBy<T extends Record<string, any>>(items: T[], key: string) {
  const out: Record<string, T[]> = {};
  for (const it of items) {
    const k = (it?.[key] ?? "Otros") as string;
    out[k] = out[k] ?? [];
    out[k].push(it);
  }
  return out;
}

export default async function HomePage() { // <--- Ahora es 'async' para verificar la sesión
  const session = await auth(); // <--- Verificamos si el usuario ya entró
  const posts: any[] = getAllPosts();

  const sorted = [...posts].sort((a, b) => {
    const da = a?.date ? Date.parse(a.date) : 0;
    const db = b?.date ? Date.parse(b.date) : 0;
    return db - da;
  });

  const destacado = sorted[0];
  const recientes = sorted.slice(1, 7);
  const porSeccion = groupBy(sorted, "section");
  const numeroVigente = sorted.find((p) => p?.issue)?.issue ?? "Vol. 1, No. 1 (2026)";

  return (
    <section className="space-y-12">
      {/* Encabezado editorial */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-zinc-700">
            <span className="font-medium">Número vigente:</span>
            <span>{numeroVigente}</span>
            </div>

            {/* AQUI MOSTRAMOS QUIÉN ESTÁ CONECTADO (Si lo hay) */}
            {session?.user && (
                <div className="text-sm text-zinc-600 flex items-center gap-2">
                    <span>Hola, {session.user.name}</span>
                    <form action={async () => { "use server"; await signOut(); }}>
                        <button className="text-red-500 hover:underline text-xs">(Salir)</button>
                    </form>
                </div>
            )}
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">
          Cuadernos Abiertos
        </h1>

        <p className="text-zinc-600 max-w-3xl">
          Revista interdisciplinaria de acceso público. Publicamos textos con
          rigor académico y vocación de claridad en tecnología, nutrición,
          psicología, ciencias sociales y ciencia política.
        </p>

        <div className="flex flex-wrap gap-3 text-sm items-center">
          <Link
            className="rounded-lg border px-3 py-2 hover:bg-zinc-50"
            href="/articulos"
          >
            Ver artículos
          </Link>
          <Link
            className="rounded-lg border px-3 py-2 hover:bg-zinc-50"
            href="/envios"
          >
            Enviar manuscrito
          </Link>
          <Link
            className="rounded-lg border px-3 py-2 hover:bg-zinc-50"
            href="/secciones"
          >
            Explorar secciones
          </Link>

          {/* AQUI ESTÁ EL BOTÓN DE GOOGLE (Solo aparece si NO has iniciado sesión) */}
          {!session?.user && (
            <form action={async () => { "use server"; await signIn("google"); }}>
                <button className="rounded-lg bg-black text-white px-3 py-2 hover:bg-zinc-800 transition-colors flex items-center gap-2">
                   <span>Entrar con Google</span>
                </button>
            </form>
          )}
        </div>
      </header>

      {/* Destacado */}
      {destacado ? (
        <section className="rounded-2xl border p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            <span className="uppercase tracking-wide">Destacado</span>
            {destacado.section ? (
              <>
                <span>•</span>
                <span className="rounded-full border px-2 py-1">
                  {destacado.section}
                </span>
              </>
            ) : null}
            {destacado.type ? (
              <span className="rounded-full border px-2 py-1">
                {destacado.type}
              </span>
            ) : null}
          </div>

          <h2 className="text-2xl font-semibold leading-snug">
            <Link className="hover:underline" href={`/posts/${destacado.slug}`}>
              {destacado.title}
            </Link>
          </h2>

          {destacado.excerpt ? (
            <p className="text-zinc-700 max-w-3xl">{destacado.excerpt}</p>
          ) : null}

          <div className="text-sm text-zinc-500 flex flex-wrap gap-3">
            {destacado.date ? <span>{destacado.date}</span> : null}
            {destacado.author?.name ? (
              <span>
                Autor/a: <span className="font-medium">{destacado.author.name}</span>
              </span>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Recientes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Recientes</h3>
          <Link className="text-sm underline" href="/articulos">
            Ver todo
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recientes.map((p: any) => (
            <article key={p.slug} className="rounded-xl border p-5">
              <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                {p.section ? (
                  <span className="rounded-full border px-2 py-1">{p.section}</span>
                ) : null}
                {p.type ? (
                  <span className="rounded-full border px-2 py-1">{p.type}</span>
                ) : null}
              </div>

              <h4 className="mt-2 text-lg font-semibold leading-snug">
                <Link className="hover:underline" href={`/posts/${p.slug}`}>
                  {p.title}
                </Link>
              </h4>

              {p.date ? <div className="mt-1 text-sm text-zinc-500">{p.date}</div> : null}
              {p.excerpt ? <p className="mt-2 text-zinc-700">{p.excerpt}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {/* Tabla de contenidos por secciones */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Tabla de contenidos</h3>

        <div className="grid gap-4">
          {Object.entries(porSeccion).map(([sec, items]) => (
            <div key={sec} className="rounded-xl border p-5">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold">{sec}</h4>
                <Link className="text-sm underline" href="/articulos">
                  Ver sección
                </Link>
              </div>

              <ul className="mt-3 space-y-2">
                {items.slice(0, 4).map((p: any) => (
                  <li key={p.slug} className="flex flex-col">
                    <Link className="hover:underline font-medium" href={`/posts/${p.slug}`}>
                      {p.title}
                    </Link>
                    <div className="text-sm text-zinc-500">
                      {p.author?.name ? <>Autor/a: {p.author.name}</> : null}
                      {p.date ? <> • {p.date}</> : null}
                      {p.type ? <> • {p.type}</> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Nota de indexación (fase inicial) */}
      <section className="rounded-xl border p-5 text-sm text-zinc-600">
        <div className="font-medium text-zinc-800">Fase inicial (pre-indexación)</div>
        <p className="mt-2">
          En esta etapa, la revista prioriza consistencia editorial, calidad de dictamen y
          trazabilidad de referencias. La indexación se abordará en una fase posterior,
          una vez estabilizados los procesos y la periodicidad.
        </p>
      </section>
    </section>
  );
}
