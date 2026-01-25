import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; 
import { put } from "@vercel/blob"; 
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function safeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ----------------------------------------------------------------------
// POST: RECEPCIÓN DE MANUSCRITOS (CON SOPORTE NUBE VERCEL BLOB)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1. Recibir datos
    const title = String(form.get("title") || "").trim();
    const section = String(form.get("section") || "").trim();
    const type = String(form.get("type") || "").trim();
    const authors = String(form.get("authors") || "").trim();
    const correspondingAuthor = String(form.get("correspondingAuthor") || "").trim();
    const email = String(form.get("email") || "").trim();
    const affiliation = String(form.get("affiliation") || "").trim();
    const abstract = String(form.get("abstract") || "").trim();
    const keywords = String(form.get("keywords") || "").trim();
    const file = form.get("file") as File | null;

    if (!title || !section || !type || !authors || !correspondingAuthor || !email) {
      return NextResponse.json({ ok: false, error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const id = `CA-${Date.now().toString(36).toUpperCase()}`;
    let fileUrl = "";

    // 2. LÓGICA DE GUARDADO INTELIGENTE
    if (file && file.size > 0) {
      const ext = (file.name || "").split(".").pop()?.toLowerCase() || "pdf";
      const filename = `${safeName(id)}-${safeName(title).slice(0, 50)}.${ext}`;

      // A) MODO PRODUCCIÓN (Vercel Blob)
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        // console.log("☁️ Subiendo a Vercel Blob Storage...");
        const blob = await put(filename, file, {
          access: 'public',
        });
        fileUrl = blob.url;
      } 
      // B) MODO DESARROLLO (Local)
      else {
        // console.log("💻 Guardando en disco local...");
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileAbs = path.join(uploadDir, filename);
        const buf = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(fileAbs, buf);
        
        fileUrl = `/uploads/${filename}`;
      }
    }

    // 3. Guardar en Base de Datos
    const submission = await prisma.submission.create({
      data: {
        id, // Forzamos el ID personalizado CA-XXXX
        title,
        section,
        type,
        authorName: authors,
        correspondingAuthor,
        email,
        affiliation,
        abstract,
        keywords,
        fileUrl, 
        status: "recibido",
      },
    });

    return NextResponse.json({ ok: true, id: submission.id });

  } catch (e: any) {
    console.error("Error crítico en POST:", e);
    return NextResponse.json({ ok: false, error: "Error al procesar el envío." }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// GET: CONSULTA INTELIGENTE (ID ÚNICO O LISTA POR EMAIL)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await auth(); 
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const emailParam = url.searchParams.get("email"); // <--- NUEVO: Buscar por email

    // CASO A: BUSCAR UN ARTÍCULO ESPECÍFICO (Rastreo antiguo)
    if (id) {
      const found = await prisma.submission.findUnique({
        where: { id: id }
      });

      if (!found) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });

      // Verificamos permisos
      const isOwner = session?.user?.email === found.email;
      const isAdmin = session?.user?.email === "raul.dubon@ues.edu.sv"; 

      if (isOwner || isAdmin) {
         return NextResponse.json({ ok: true, item: found });
      } else {
        // Vista pública restringida (Solo datos básicos)
        return NextResponse.json({
          ok: true,
          item: {
            id: found.id,
            title: found.title,
            status: found.status,
            createdAt: found.createdAt,
          }
        });
      }
    }

    // CASO B: BUSCAR TODOS LOS ARTÍCULOS DE UN AUTOR (NUEVO DASHBOARD)
    if (emailParam) {
        // Buscamos todo lo que coincida con el email
        const submissions = await prisma.submission.findMany({
            where: { email: { equals: emailParam, mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ ok: true, items: submissions });
    }

    // CASO C: LISTA COMPLETA (SOLO ADMINS)
    // Si no hay ID ni Email, asumimos que es el administrador queriendo ver todo
    const isAdmin = session?.user?.email === "raul.dubon@ues.edu.sv"; // Ajusta tu email admin
    
    if (!isAdmin) {
       return NextResponse.json({ ok: false, error: "No autorizado para ver todo el listado." }, { status: 401 });
    }

    const items = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ ok: true, items });
    
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ ok: false, items: [] }, { status: 500 });
  }
}