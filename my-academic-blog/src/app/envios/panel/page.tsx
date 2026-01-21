"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";

/**
 * 🔒 LISTA DE EDITORES AUTORIZADOS
 * AQUI ESTA TU CORREO CORRECTO AHORA
 */
const EDITORS = [
  "raul.dubon95@gmail.com", 
  "rauldubon95-ctrl@gmail.com" // Dejo este por si acaso entras con el otro
];

// Clave maestra (debe coincidir con la API)
const ADMIN_KEY = "CAMBIAME-123"; 

const STATUSES = [
  { v: "recibido", t: "Recibido" },
  { v: "revision-editorial", t: "Revisión editorial" },
  { v: "en-revision", t: "En revisión por pares" },
  { v: "cambios-solicitados", t: "Cambios solicitados" },
  { v: "aceptado", t: "Aceptado" },
  { v: "rechazado", t: "Rechazado" },
  { v: "publicado", t: "Publicado" },
] as const;

export default function PanelPage() {
  const { data: session, status } = useSession();

  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  
  // Estados para Revisores
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [magicLink, setMagicLink] = useState("");

  const statusLabel = useMemo(() => {
    const m = new Map<string, string>();
    STATUSES.forEach((s) => m.set(s.v, s.t));
    return m;
  }, []);

  const userEmail = session?.user?.email;

  // Cargar envíos al iniciar
  useEffect(() => {
    if (status === "authenticated" && userEmail && isEditor(userEmail)) {
      loadSubmissions();
    }
  }, [status, userEmail]);

  // Cargar revisores al seleccionar un artículo
  useEffect(() => {
    if (selected?.id) {
      loadReviewers(selected.id);
      setMagicLink("");
      setMsg(null);
    }
  }, [selected]);

  function isEditor(email: string) {
    if (!email) return false;
    if (EDITORS.length === 0) return true;
    return EDITORS.some(e => email.includes(e) || e === email);
  }

  async function loadSubmissions() {
    setLoading(true);
    try {
      const res = await fetch("/api/envios", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviewers(submissionId: string) {
    const res = await fetch(`/api/revisores?submissionId=${submissionId}`);
    const json = await res.json();
    if (json.ok) setReviewers(json.items || []);
  }

  async function createReviewer() {
    if (!selected || !newReviewerName) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/revisores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selected.id,
          reviewerName: newReviewerName,
          key: ADMIN_KEY 
        }),
      });
      const json = await res.json();
      
      if (json.ok) {
        setMagicLink(json.magicLink);
        setNewReviewerName("");
        loadReviewers(selected.id); 
        if (selected.status === "recibido") {
            updateStatus("en-revision");
        }
      } else {
        alert("Error: " + json.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    if (!selected) return;
    const res = await fetch("/api/envios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selected, status: newStatus }),
    });
    if (res.ok) {
        setSelected({ ...selected, status: newStatus });
        loadSubmissions();
        setMsg("Estado guardado.");
    }
  }

  if (status === "loading") return <div className="p-10 text-zinc-500">Cargando panel...</div>;
  
  if (!userEmail || !isEditor(userEmail)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
        <p className="text-zinc-600 mb-4">
          No tienes permisos de editor. <br/>
          Logueado como: <strong>{userEmail || "Anónimo"}</strong>
        </p>
        <button onClick={() => signIn("google")} className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
            Iniciar Sesión con Google
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-50/50 p-6 md:p-10">
      <header className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">Panel Editorial</h1>
            <p className="text-sm text-zinc-500">Sesión: {userEmail}</p>
        </div>
        <button onClick={loadSubmissions} className="text-sm text-blue-600 font-medium hover:underline">
            Refrescar ↻
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LISTA IZQUIERDA */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bandeja de Entrada</h3>
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm max-h-[70vh] overflow-y-auto">
            {items.length === 0 && <div className="p-8 text-center text-zinc-400">Sin envíos.</div>}
            <ul className="divide-y divide-zinc-100">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    className={`w-full text-left p-4 transition-colors ${selected?.id === it.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-zinc-50 border-l-4 border-transparent'}`}
                    onClick={() => setSelected(it)}
                  >
                    <div className="font-semibold text-zinc-900 truncate">{it.title}</div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-zinc-500 truncate max-w-[15ch]">{it.authorName}</span>
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                            it.status === 'recibido' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                            {statusLabel.get(it.status)}
                        </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DETALLE DERECHA */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* 1. FICHA TÉCNICA */}
              <div className="bg-white border p-6 rounded-xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <h2 className="text-2xl font-bold text-zinc-900 leading-tight">{selected.title}</h2>
                    <a href={selected.fileUrl || "#"} target="_blank" className="shrink-0 bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-700 text-center">
                        📄 Ver PDF
                    </a>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    <p><strong>Autor:</strong> {selected.authorName}</p>
                    <p><strong>Email:</strong> {selected.email}</p>
                    <p><strong>Afiliación:</strong> {selected.affiliation}</p>
                    <p><strong>Fecha:</strong> {new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="pt-4 border-t flex items-center gap-4">
                    <label className="text-sm font-bold text-zinc-700">Estado:</label>
                    <select
                        className="border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selected.status}
                        onChange={(e) => updateStatus(e.target.value)}
                    >
                        {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.t}</option>)}
                    </select>
                    {msg && <span className="text-green-600 text-xs font-bold animate-pulse">{msg}</span>}
                </div>
              </div>

              {/* 2. GESTIÓN DE REVISORES */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-2">
                    <span className="text-xl">🕵️‍♂️</span>
                    <h3 className="font-bold text-purple-900">Revisión por Pares (Peer Review)</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Generador */}
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Nombre del Revisor (ej: Dra. López)" 
                            className="flex-1 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                            value={newReviewerName}
                            onChange={(e) => setNewReviewerName(e.target.value)}
                        />
                        <button 
                            onClick={createReviewer} 
                            disabled={loading || !newReviewerName}
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition"
                        >
                            {loading ? "..." : "Invitar"}
                        </button>
                    </div>

                    {/* Enlace Mágico */}
                    {magicLink && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg animate-in zoom-in-95">
                            <p className="text-sm font-bold text-green-800 mb-1">✅ Enlace de invitación creado:</p>
                            <div className="bg-white p-3 rounded border font-mono text-xs text-zinc-600 break-all select-all">
                                {magicLink}
                            </div>
                            <p className="text-xs text-green-700 mt-2">Copia este link y envíalo por correo al revisor.</p>
                        </div>
                    )}

                    {/* Lista */}
                    <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Revisores Asignados</h4>
                        {reviewers.length === 0 ? (
                            <p className="text-sm text-zinc-400 italic">No hay revisores asignados aún.</p>
                        ) : (
                            <ul className="space-y-3">
                                {reviewers.map((r) => (
                                    <li key={r.id} className="border p-3 rounded-lg flex justify-between items-center bg-zinc-50">
                                        <div>
                                            <div className="font-bold text-zinc-800">{r.reviewerName}</div>
                                            <div className="text-[10px] text-zinc-400 font-mono">ID: {r.token.slice(0,6)}...</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                r.status === 'completado' 
                                                ? (r.verdict === 'aceptar' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')
                                                : 'bg-zinc-200 text-zinc-600'
                                            }`}>
                                                {r.status === 'completado' ? r.verdict.toUpperCase() : 'PENDIENTE'}
                                            </span>
                                            {r.feedback && (
                                                <button onClick={() => alert(r.feedback)} className="block text-xs text-blue-600 underline mt-1">
                                                    Ver opinión
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-10 border-2 border-dashed rounded-xl bg-white">
              <span className="text-4xl mb-4 opacity-50">👈</span>
              <p>Selecciona un artículo para gestionarlo.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
