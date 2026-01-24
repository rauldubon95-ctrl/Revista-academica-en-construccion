import Container from "@/app/_components/container";
import { prisma } from "@/lib/prisma";

// ESTA LÍNEA OBLIGA A QUE LOS NÚMEROS SE ACTUALICEN SIEMPRE
export const dynamic = 'force-dynamic';

export default async function Footer() {
  const year = new Date().getFullYear();
  let stats = { views: 0, downloads: 0, countries: 0 };
  
  try {
    const totalViews = await prisma.postMetric.aggregate({
      _sum: { views: true, downloads: true }
    });
    const totalCountries = await prisma.visitorCountry.count();
    
    stats = {
      views: totalViews._sum.views || 0,
      downloads: totalViews._sum.downloads || 0,
      countries: totalCountries
    };
  } catch (e) {
    console.log("Esperando primeras métricas...");
  }

  return (
    <footer className="bg-white border-t border-zinc-200 mt-20 font-sans">
      <div className="bg-zinc-900 text-white py-8 border-b border-zinc-800">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Impacto Global (Tiempo Real)
            </div>
            
            <div className="flex gap-12 md:gap-20">
               <div className="text-center group cursor-default">
                 <span className="block font-serif font-bold text-3xl md:text-4xl text-white group-hover:text-zinc-300 transition">
                    {stats.views.toLocaleString()}
                 </span>
                 <span className="text-[10px] uppercase tracking-widest text-zinc-500">Lecturas</span>
               </div>
               <div className="text-center group cursor-default">
                 <span className="block font-serif font-bold text-3xl md:text-4xl text-white group-hover:text-zinc-300 transition">
                    {stats.downloads.toLocaleString()}
                 </span>
                 <span className="text-[10px] uppercase tracking-widest text-zinc-500">Descargas</span>
               </div>
               <div className="text-center group cursor-default">
                 <span className="block font-serif font-bold text-3xl md:text-4xl text-white group-hover:text-zinc-300 transition">
                    {stats.countries}
                 </span>
                 <span className="text-[10px] uppercase tracking-widest text-zinc-500">Países</span>
               </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-zinc-50 pt-16 pb-12">
        <Container>
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5 space-y-6">
              <h3 className="text-lg font-serif font-bold text-zinc-900">Cuadernos Abiertos</h3>
              <p className="text-sm text-zinc-500 text-justify leading-relaxed">
                Plataforma de difusión científica comprometida con el acceso abierto y la rigurosidad académica.
                Arbitraje por pares doble ciego.
              </p>
            </div>
            <div className="md:col-span-4 space-y-4">
               <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider">Indexaciones</h4>
               <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
               </div>
               <p className="text-[10px] text-zinc-400">En proceso de indexación: Latindex, Redalyc.</p>
            </div>
            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider mb-2">Navegación</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="/articulos" className="hover:text-black hover:underline">Archivo Histórico</a></li>
                <li><a href="/equipo-editorial" className="hover:text-black hover:underline">Consejo Editorial</a></li>
                <li><a href="/envios/panel" className="font-bold text-zinc-900 hover:text-black mt-4 block">→ Acceso Editor</a></li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 font-mono">
        ISSN: En trámite &bull; San Salvador, El Salvador &bull; {year}
      </div>
    </footer>
  );
}