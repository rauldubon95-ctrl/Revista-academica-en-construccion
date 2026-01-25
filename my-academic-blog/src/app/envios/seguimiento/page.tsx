"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SeguimientoPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuración visual de estados
  const statusConfig: Record<string, { label: string; color: string }> = {
    "recibido": { label: "Recibido", color: "bg-blue-100 text-blue-700 border-blue-200" },
    "revision-editorial": { label: "Revisión Editorial", color: "bg-purple-100 text-purple-700 border-purple-200" },
    "en-revision": { label: "En Revisión por Pares", color: "bg-amber-100 text-amber-700 border-amber-200" },
    "cambios-solicitados": { label: "Cambios Solicitados", color: "bg-orange-100 text-orange-700 border-orange-200" },
    "aceptado": { label: "Aceptado", color: "bg-green-100 text-green-700 border-green-200" },
    "rechazado": { label: "Rechazado", color: "bg-red-100 text-red-700 border-red-200" },
    "publicado": { label: "Publicado", color: "bg-zinc-900 text-white border-zinc-900" },
  };

  useEffect(() => {
    async function fetchSubmissions() {
      // Usamos ?. para evitar errores si session es null momentáneamente
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/envios?email=${encodeURIComponent(session.user.email)}`, {
            cache: "no-store",
          });
          const json = await res.json();
          
          if (json.ok && Array.isArray(json.items)) {
            setSubmissions(json.items);
          } else if (json.ok && json.item) {
             setSubmissions([json.item]);
          } else {
             setSubmissions([]);
          }
        } catch (error) {
          console.error("Error cargando envíos:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchSubmissions();
    }
  }, [session, status]);

  // VISTA: CARGANDO
  if (status === "loading" || loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400">
            <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p>Sincronizando expediente...</p>
        </div>
    );
  }

  // VISTA: NO LOGUEADO
  if (status === "unauthenticated") {
    return (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
            <h2 className="text-xl font-serif font-bold text-zinc-900">Acceso Restringido</h2>
            <p className="text-zinc-600 mt-2">Inicie sesión para ver su historial de publicaciones.</p>
            <Link href="/api/auth/signin" className="inline-block mt-4 text-sm font-bold underline">Iniciar Sesión</Link>
        </div>
    );
  }

  // VISTA: SIN ARTÍCULOS
  if (submissions.length === 0) {
    return (
        <div className="space-y-6">
            <header className="border-b border-zinc-200 pb-6">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Mis Envíos</h1>
                <p className="text-zinc-600">Historial de manuscritos enviados a evaluación.</p>
            </header>
            <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
                <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-lg font-medium text-zinc-900">No tiene envíos activos</h3>
                <p className="text-zinc-500 mt-1 max-w-sm mx-auto">Aún no ha enviado ningún manuscrito para evaluación en Cuadernos Abiertos.</p>
                <Link href="/envios" className="mt-6 inline-block bg-zinc-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors">
                    Realizar Nuevo Envío
                </Link>
            </div>
        </div>
    );
  }

  // VISTA: TABLA DE RESULTADOS
  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 pb-6 gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900">Mis Envíos</h1>
            <p className="text-zinc-600 mt-2">
                {/* AQUÍ ESTABA EL ERROR: Agregamos ? antes de .email */}
                Gestionando <span className="font-bold text-zinc-900">{submissions.length}</span> manuscrito(s) asociado(s) a <span className="font-mono text-sm bg-zinc-100 px-2 py-1 rounded">{session?.user?.email}</span>
            </p>
        </div>
        <Link href="/envios" className="text-sm font-bold text-zinc-900 hover:underline flex items-center gap-1">
            + Nuevo Manuscrito
        </Link>
      </header>

      <div className="grid gap-6">
        {submissions.map((item) => {
            const statusInfo = statusConfig[item.status] || { label: item.status, color: "bg-zinc-100 text-zinc-600" };
            
            return (
                <article key={item.id} className="group bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${statusInfo.color}`}>
                                {statusInfo.label}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono mt-1">ID: {item.id}</span>
                        </div>
                        <div className="text-xs text-zinc-500">
                            Actualizado: {new Date(item.lastUpdatedAt || item.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {item.title}
                    </h2>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-zinc-600 mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            {item.section}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            {item.type}
                        </div>
                    </div>

                    {item.editorialNotes && (
                        <div className="mt-4 bg-zinc-50 border-l-4 border-zinc-300 p-4 rounded-r-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                Mensaje del Editor:
                            </div>
                            <p className="text-zinc-700 whitespace-pre-wrap">{item.editorialNotes}</p>
                        </div>
                    )}
                </article>
            );
        })}
      </div>
    </section>
  );
}