import { prisma } from "@/lib/prisma";
import { ReviewClientWrapper } from "./client-wrapper";

export const dynamic = "force-dynamic";

export default async function RevisionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">🚫</div>
          <h1 className="text-xl font-bold text-red-600">Enlace Incompleto</h1>
          <p className="text-zinc-600">Verifica el enlace.</p>
        </div>
      </div>
    );
  }

  const review = await prisma.reviewToken.findUnique({
    where: { token },
    include: { submission: true },
  });

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">🕰️</div>
          <h1 className="text-xl font-bold text-zinc-900">Enlace Caducado</h1>
          <p className="text-zinc-600">Esta invitación ya no es válida.</p>
        </div>
      </div>
    );
  }

  if (review.status === "completado") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-green-100">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">¡Evaluación Recibida!</h1>
          <p className="text-green-700">Para: <strong>"{review.submission.title}"</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 font-sans">
      <header className="bg-white border-b py-4 px-6 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-zinc-900">Cuadernos Abiertos</div>
          <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold bg-zinc-100 px-2 py-1 rounded">Revisión Ciega</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 grid gap-8 animate-in fade-in duration-700">
        <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <div>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">Artículo Asignado</span>
            <h1 className="mt-4 text-2xl md:text-3xl font-serif font-medium text-zinc-900 leading-tight">{review.submission.title}</h1>
          </div>
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Resumen</h3>
            <p className="text-zinc-700 leading-relaxed text-sm md:text-base">{review.submission.abstract || "Sin resumen."}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6 items-start sm:items-center">
            <a href={review.submission.fileUrl || "#"} target="_blank" className="bg-zinc-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-700 transition">📄 Descargar PDF</a>
          </div>
        </section>

        <ReviewClientWrapper token={token} reviewerName={review.reviewerName || "Colega"} />
      </div>
    </main>
  );
}
