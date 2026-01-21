import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import Footer from "@/app/_components/footer"; // <--- AQUÍ ESTÁ LA MAGIA
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Cuadernos Abiertos",
  description: "Revista académica interdisciplinaria de acceso abierto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} bg-[#F9F9F7] text-zinc-800 antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          {/* FRANJA SUPERIOR */}
          <div className="w-full h-1.5 bg-zinc-900 fixed top-0 left-0 z-50"></div>

          <div className="flex-1 flex justify-center py-8 md:py-12 px-4 sm:px-6">
            <main className="w-full max-w-6xl bg-white shadow-2xl shadow-zinc-900/5 border border-zinc-200 flex flex-col relative mt-2">

              {/* NAVBAR */}
              <nav className="border-b border-zinc-100 px-6 py-5 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
                <Link href="/" className="group">
                  <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
                    Cuadernos Abiertos
                  </h1>
                  <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest mt-1">
                    Revista Interdisciplinaria
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-600">
                  <Link href="/" className="hover:text-zinc-900 hover:underline">
                    Inicio
                  </Link>
                  <Link href="/equipo-editorial" className="hover:text-zinc-900 hover:underline">
                    Equipo Editorial
                  </Link>
                  <Link href="/articulos" className="hover:text-zinc-900 hover:underline">
                    Archivo
                  </Link>
                  <Link
                    href="/envios"
                    className="px-3 py-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 transition-colors"
                  >
                    Enviar Artículo
                  </Link>
                </div>
              </nav>

              {/* CONTENIDO */}
              <div className="flex-1 px-6 py-10 md:px-16 md:py-14 min-h-[60vh]">
                {children}
              </div>

              {/* POWER FOOTER IMPORTADO */}
              <Footer />
              
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
