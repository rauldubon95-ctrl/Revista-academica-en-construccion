"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

const SECCIONES = [
  "Tecnología y Sociedad",
  "Salud y Nutrición",
  "Psicología y Conducta",
  "Ciencias Sociales",
  "Ciencia Política y Políticas Públicas",
  "Métodos y Datos",
  "Reseñas y Debate",
];

const TIPOS = [
  "Artículo de investigación",
  "Ensayo",
  "Revisión (estado del arte)",
  "Nota técnica / método",
  "Comentario / réplica",
  "Reseña",
];

export default function EnviosPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lógica de inicialización
  }, []);

  const helper = useMemo(() => ({ pdf: "PDF (.pdf)", docx: "Word (.docx)" }), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return; 

    setError(null);
    setResultId(null);
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      
      // SOLUCIÓN 1: Usamos ?. (optional chaining) para evitar el error aquí
      if (session?.user?.email) {
        form.set("email", session.user.email);
      }

      const res = await fetch("/api/envios", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "No se pudo procesar el envío.");
        setLoading(false);
        return;
      }

      setResultId(data.id);
      e.currentTarget.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err: any) {
      setError(err?.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  // 1. ESTADO DE CARGA
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-zinc-400">Cargando entorno editorial...</div>;
  }

  // 2. VISTA PARA NO AUTENTICADOS (LOGIN GATE)
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-zinc-100 p-4 rounded-full mb-6">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">Acceso a Autores</h1>
        <p className="text-lg text-zinc-600 max-w-lg mb-8">
            Para garantizar la integridad académica y el seguimiento de los manuscritos, es necesario identificarse antes de realizar un envío.
        </p>
        <button 
            onClick={() => signIn("google")}
            className="flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-transform hover:scale-105 shadow-xl"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Iniciar Sesión con Google
        </button>
      </div>
    );
  }

  // SOLUCIÓN 2: LA LÍNEA MÁGICA
  // Si llegamos aquí, status no es loading ni unauthenticated.
  // Pero TypeScript necesita estar 100% seguro de que 'session' existe.
  if (!session) return null; 

  // VISTA PARA AUTORES AUTENTICADOS (DASHBOARD)
  return (
    <div className="animate-in fade-in duration-500 font-sans pb-20">
      
      {/* 1. ENCABEZADO */}
      <header className="mb-10 border-b border-zinc-200 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">
                  Centro de Autores
                </h1>
                <p className="mt-2 text-zinc-600">
                  Bienvenido, <span className="font-semibold text-zinc-900">{session.user?.name}</span>. Gestione sus contribuciones científicas.
                </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sistema Operativo</span>
            </div>
        </div>
      </header>

      {/* 2. BARRA DE NAVEGACIÓN INTELIGENTE */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        
        {/* Tarjeta 1: Nuevo Envío */}
        <div className="relative overflow-hidden rounded-xl border-2 border-zinc-900 bg-zinc-900 p-5 text-white shadow-xl cursor-default">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="font-bold text-lg">Nuevo Manuscrito</span>
          </div>
          <p className="text-sm text-zinc-400 mt-2 relative z-10">Complete el formulario a continuación para iniciar un proceso editorial.</p>
        </div>

        {/* Tarjeta 2: MIS ENVÍOS */}
        <Link 
          href="/envios/seguimiento" 
          className="group relative rounded-xl border border-zinc-200 bg-white p-5 text-zinc-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="flex items-center gap-3 group-hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span className="font-semibold text-lg">Mis Envíos</span>
          </div>
          <p className="text-sm text-zinc-400 mt-2 group-hover:text-zinc-500">
             Consulte el estado de sus <span className="font-bold">artículos enviados</span> en tiempo real.
          </p>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">→</div>
        </Link>

        {/* Tarjeta 3: Panel Editorial */}
        <Link 
          href="/envios/panel" 
          className="group relative rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-zinc-500 hover:bg-white hover:border-zinc-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 group-hover:text-zinc-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="font-semibold text-lg">Acceso Editorial</span>
          </div>
          <p className="text-sm text-zinc-400 mt-2">Área restringida para revisores y editores de la revista.</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* 3. BARRA LATERAL */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm sticky top-24">
            <h3 className="font-serif font-bold text-zinc-900 mb-6 flex items-center gap-2 border-b pb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Guía Rápida
            </h3>
            
            <div className="space-y-6">
                <div>
                    <h4 className="text-xs font-bold uppercase text-zinc-500 mb-2">Checklist de Envío</h4>
                    <ul className="space-y-2 text-sm text-zinc-700">
                        <li className="flex gap-2"><span className="text-green-500">✔</span> Anonimizado (sin nombres)</li>
                        <li className="flex gap-2"><span className="text-green-500">✔</span> Formato APA 7</li>
                        <li className="flex gap-2"><span className="text-green-500">✔</span> ORCID de autores</li>
                    </ul>
                </div>

                <div>
                     <h4 className="text-xs font-bold uppercase text-zinc-500 mb-2">Tiempos Promedio</h4>
                     <div className="bg-zinc-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                            <span className="text-zinc-600">Revisión preliminar:</span>
                            <span className="font-bold">7 días</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-600">Dictamen pares:</span>
                            <span className="font-bold">4-6 semanas</span>
                        </div>
                     </div>
                </div>
            </div>
          </div>
        </aside>

        {/* 4. FORMULARIO PRINCIPAL */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-1">
            
            {resultId && (
              <div className="mb-8 rounded-xl border-l-4 border-green-500 bg-green-50 p-6 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="text-green-800 font-bold text-xl">¡Envío Exitoso!</div>
                </div>
                <p className="text-zinc-700 ml-11">
                    Su manuscrito ha entrado en la fase de <strong>Recepción</strong>. Puede ver el estado en la sección "Mis Envíos".
                </p>
                <div className="mt-4 ml-11 flex gap-4">
                    <Link href="/envios/seguimiento" className="text-sm font-bold text-green-700 hover:underline">Ir a Mis Envíos →</Link>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 items-start text-red-800">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <p className="font-bold">No se pudo completar el envío</p>
                    <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-10 p-4 md:p-8">
              {/* Sección: Detalles del Artículo */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                    <h2 className="text-xl font-serif font-bold text-zinc-900">Metadatos del Manuscrito</h2>
                </div>
                
                <div className="grid gap-6 pl-12">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Título Completo *</label>
                    <input
                      name="title"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-lg font-medium placeholder:font-normal focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="Ej: Análisis sociológico de..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Sección Temática *</label>
                      <select name="section" required className="w-full rounded-lg border border-zinc-300 px-4 py-3 bg-white focus:border-black focus:ring-black" defaultValue="">
                        <option value="" disabled>Seleccione...</option>
                        {SECCIONES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Tipo de Trabajo *</label>
                      <select name="type" required className="w-full rounded-lg border border-zinc-300 px-4 py-3 bg-white focus:border-black focus:ring-black" defaultValue="">
                        <option value="" disabled>Seleccione...</option>
                        {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Resumen / Abstract (Máx. 250 palabras)</label>
                    <textarea name="abstract" rows={4} className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-black focus:ring-black" placeholder="Introducción, métodos, resultados y conclusiones..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Palabras Clave</label>
                    <input name="keywords" className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-black focus:ring-black" placeholder="Separe con punto y coma (;)" />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 my-8"></div>

              {/* Sección: Autoría (Pre-llenada) */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                    <h2 className="text-xl font-serif font-bold text-zinc-900">Responsabilidad de Autoría</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pl-12">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Lista completa de autores *</label>
                    <input
                      name="authors"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-black focus:ring-black bg-zinc-50"
                      placeholder="Apellido, Nombre; Apellido, Nombre..."
                      defaultValue={session?.user?.name || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Autor de correspondencia</label>
                    <input
                      name="correspondingAuthor"
                      required
                      readOnly
                      className="w-full rounded-lg border border-zinc-200 px-4 py-3 bg-zinc-100 text-zinc-500 cursor-not-allowed"
                      defaultValue={session?.user?.name || ""}
                      title="No editable: vinculado a la cuenta actual"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Correo verificado</label>
                    <input
                      name="email"
                      type="email"
                      required
                      readOnly
                      className="w-full rounded-lg border border-zinc-200 px-4 py-3 bg-zinc-100 text-zinc-500 cursor-not-allowed"
                      defaultValue={session?.user?.email || ""}
                      title="No editable: vinculado a la cuenta actual"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Afiliación Institucional</label>
                    <input name="affiliation" className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-black focus:ring-black" placeholder="Universidad, Facultad, País..." />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 my-8"></div>

              {/* Sección: Archivos */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                    <h2 className="text-xl font-serif font-bold text-zinc-900">Carga de Archivos</h2>
                </div>
                
                <div className="pl-12">
                    <div className="border-2 border-dashed border-zinc-300 rounded-xl p-10 text-center hover:bg-stone-50 hover:border-zinc-400 transition-all cursor-pointer group">
                    <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <label className="block cursor-pointer">
                        <span className="text-zinc-900 font-bold text-lg hover:underline decoration-2 underline-offset-4">Seleccionar Manuscrito</span>
                        <input name="file" type="file" required accept=".pdf,.docx" className="hidden" />
                    </label>
                    <p className="text-sm text-zinc-500 mt-2">Solo archivos anónimos en formato PDF o Word.</p>
                    </div>

                    <div className="mt-6 flex items-start gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    <input id="originalidad" name="originalidad" type="checkbox" required className="mt-1 h-5 w-5 rounded border-zinc-300 text-black focus:ring-black" />
                    <label htmlFor="originalidad" className="text-sm text-zinc-700 cursor-pointer select-none">
                        Confirmo que el manuscrito es original, no ha sido publicado previamente y todos los autores han aprobado el contenido y la autoría del mismo.
                    </label>
                    </div>

                    <div className="pt-8 flex justify-end">
                    <button
                        disabled={loading}
                        className="bg-zinc-900 text-white rounded-xl px-10 py-4 font-bold text-lg hover:bg-black shadow-xl shadow-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
                        type="submit"
                    >
                        {loading ? "Enviando..." : "Confirmar Envío"}
                    </button>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}