"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewClientWrapper({ token, reviewerName }: { token: string, reviewerName: string }) {
  const router = useRouter();
  const [verdict, setVerdict] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!verdict) return alert("Seleccione un veredicto.");
    if(!confirm("¿Enviar evaluación final?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/revisores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, verdict, feedback }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const json = await res.json();
        alert("Error: " + (json.error || "Intente nuevamente"));
      }
    } catch (err) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-zinc-900">Dictamen</h2>
        <p className="text-zinc-600 mt-1">Estimado/a <strong>{reviewerName}</strong>, indique su decisión.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-zinc-900 uppercase tracking-wide">1. Veredicto *</label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: "aceptar", icon: "✅", label: "Aceptar", desc: "Publicable." },
              { id: "cambios", icon: "⚠️", label: "Con Cambios", desc: "Requiere correcciones." },
              { id: "rechazar", icon: "❌", label: "Rechazar", desc: "No cumple criterios." },
            ].map((op) => (
              <label key={op.id} className="cursor-pointer group relative">
                <input type="radio" name="verdict" value={op.id} className="peer sr-only" onChange={(e) => setVerdict(e.target.value)} />
                <div className="h-full border-2 border-zinc-100 rounded-xl p-5 hover:bg-zinc-50 peer-checked:border-purple-500 peer-checked:bg-purple-50 transition-all">
                  <div className="text-2xl mb-2">{op.icon}</div>
                  <div className="font-bold text-zinc-900">{op.label}</div>
                  <div className="text-xs text-zinc-500 mt-1">{op.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-900 uppercase tracking-wide">2. Comentarios *</label>
          <textarea 
            className="w-full border border-zinc-300 rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Argumente su decisión..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <div className="pt-6 border-t flex justify-end">
          <button type="submit" disabled={loading || !verdict} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition">
            {loading ? "Enviando..." : "Enviar Evaluación"}
          </button>
        </div>
      </form>
    </section>
  );
}
