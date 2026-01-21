import Container from "@/app/_components/container";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-200 mt-20 font-sans">
      
      {/* 1. BARRA DE MÉTRICAS (Dashboard) */}
      <div className="bg-zinc-900 text-white py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Métricas de Impacto
            </div>
            
            <div className="flex gap-8 md:gap-16">
               <div className="text-center">
                 <span className="block font-bold text-2xl md:text-3xl text-blue-400">1,204</span>
                 <span className="text-[10px] uppercase tracking-wide text-zinc-400">Lecturas</span>
               </div>
               <div className="text-center">
                 <span className="block font-bold text-2xl md:text-3xl text-green-400">450</span>
                 <span className="text-[10px] uppercase tracking-wide text-zinc-400">Descargas</span>
               </div>
               <div className="text-center">
                 <span className="block font-bold text-2xl md:text-3xl text-purple-400">12</span>
                 <span className="text-[10px] uppercase tracking-wide text-zinc-400">Países</span>
               </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="bg-zinc-50 pt-16 pb-12">
        <Container>
          <div className="grid md:grid-cols-12 gap-12">
            
            <div className="md:col-span-4 space-y-6">
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Cuadernos Abiertos</h3>
              <p className="text-sm text-zinc-600 text-justify">
                Revista académica de acceso abierto, arbitrada y comprometida con la 
                democratización del conocimiento en ciencias sociales.
              </p>
              <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm inline-block">
                <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Licencia</div>
                <div className="font-bold text-zinc-800 text-sm">CC BY-NC-SA 4.0</div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
               <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                 <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider">Indexaciones</h4>
                 <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">En Trámite</span>
               </div>
               <div className="grid grid-cols-3 gap-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-12 bg-white rounded border border-zinc-200 flex items-center justify-center text-[10px] text-zinc-300 font-bold">
                     LOGO {i}
                   </div>
                 ))}
               </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider border-b border-zinc-200 pb-2">Enlaces</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="/articulos" className="hover:text-blue-600">📂 Archivo</a></li>
                <li><a href="/equipo-editorial" className="hover:text-blue-600">👥 Equipo</a></li>
                <li><a href="/envios" className="hover:text-blue-600">📝 Envíos</a></li>
                <li><a href="/envios/panel" className="font-bold text-zinc-900 hover:text-purple-600 mt-2 block">🔐 Editor</a></li>
              </ul>
            </div>

          </div>
        </Container>
      </div>

      {/* 3. COPYRIGHT */}
      <div className="bg-zinc-100 border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        &copy; {year} Universidad / Institución. | ISSN: <span className="font-bold text-zinc-800">En trámite</span> | San Salvador.
      </div>
    </footer>
  );
}
