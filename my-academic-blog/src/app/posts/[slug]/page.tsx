import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { prisma } from "@/lib/prisma"; // <--- CONEXIÓN A LA BASE DE DATOS

// Eliminamos MetricTracker porque ahora el servidor hará el conteo directo
// Eliminamos PostHeader para construir uno personalizado con métricas

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  // ---------------------------------------------------------
  // 1. LÓGICA INTELIGENTE: CONTAR VISITA Y OBTENER DATOS
  // ---------------------------------------------------------
  let metrics;
  try {
    // Upsert: Si existe, suma 1. Si no existe, créalo con 1.
    metrics = await prisma.postMetric.upsert({
      where: { slug: params.slug },
      update: { views: { increment: 1 } },
      create: { slug: params.slug, views: 1, downloads: 0 },
    });
  } catch (error) {
    console.error("Error conectando a métricas:", error);
    // Si falla la BD, mostramos 0 para no romper la página
    metrics = { views: 0, downloads: 0 };
  }

  return (
    <main>
      <Container>
        
        <article className="mb-32 pt-10">
          
          {/* 2. ENCABEZADO "SÚPER PRO" PERSONALIZADO */}
          <div className="max-w-4xl mx-auto mb-12 border-b border-zinc-200 pb-10">
            
            {/* Categoría y Fecha */}
            <div className="flex items-center gap-4 mb-6">
                <span className="bg-zinc-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Artículo Científico
                </span>
                <span className="text-zinc-500 font-mono text-sm">
                    {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-tight text-zinc-900 mb-8">
                {post.title}
            </h1>

            {/* BARRA DE MÉTRICAS Y AUTOR */}
            <div className="flex flex-wrap items-center gap-8 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                
                {/* Autor */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden shadow-sm">
                         <img src={post.author.picture} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Autoría</span>
                        <span className="font-bold text-zinc-900 text-sm">{post.author.name}</span>
                    </div>
                </div>

                {/* Separador vertical */}
                <div className="w-px h-10 bg-zinc-200 hidden md:block"></div>

                {/* MÉTRICA: LECTURAS (Dato Real) */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Lecturas</span>
                        <span className="font-mono font-bold text-zinc-900 text-lg">
                            {metrics.views.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* MÉTRICA: DESCARGAS (Dato Real) */}
                <div className="flex items-center gap-3 opacity-70" title="Descargas totales del PDF">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Descargas</span>
                        <span className="font-mono font-bold text-zinc-900 text-lg">
                            {metrics.downloads.toLocaleString()}
                        </span>
                    </div>
                </div>

            </div>
          </div>

          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Cuadernos Abiertos`;

  const ogImages =
    post.ogImage?.url
      ? [post.ogImage.url]
      : post.coverImage
        ? [post.coverImage]
        : [];

  return {
    title,
    openGraph: {
      title,
      images: ogImages,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}