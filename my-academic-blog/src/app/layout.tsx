import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google"; 
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
  description: "Revista académica interdisciplinaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} bg-stone-100 text-zinc-800 antialiased`}
      >
        <div className="min-h-screen flex justify-center py-6 md:py-10 px-4">
          <main className="w-full max-w-5xl bg-white shadow-xl shadow-stone-200/50 rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-8 md:px-12 md:py-12">
              {children}
            </div>
            <footer className="mt-12 border-t pt-6 text-center text-xs text-zinc-400 pb-2">
              <p>&copy; {new Date().getFullYear()} Cuadernos Abiertos. ISSN en trámite.</p>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
