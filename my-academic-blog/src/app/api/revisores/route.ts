import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

// POST: Generar un nuevo enlace de revisión (Magic Link)
// (Usado por el Editor desde el Panel)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const submissionId = String(body?.submissionId || "");
    const key = String(body?.key || "");
    const reviewerName = String(body?.reviewerName || "Anónimo");

    // 1. SEGURIDAD: Solo el Editor (tú) puede crear links
    const ADMIN_KEY = process.env.CA_ADMIN_KEY || "CAMBIAME-123";
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    if (!submissionId) {
      return NextResponse.json({ ok: false, error: "Falta ID del artículo" }, { status: 400 });
    }

    // 2. GENERAR TOKEN ÚNICO (Criptografía segura)
    const token = randomBytes(16).toString("hex");

    // 3. GUARDAR EN BASE DE DATOS
    const newReview = await prisma.reviewToken.create({
      data: {
        token,
        submissionId,
        reviewerName,
        status: "pendiente",
      },
    });

    // 4. DEVOLVER EL LINK LISTO
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const magicLink = `${origin}/revision/evaluar?token=${token}`;

    return NextResponse.json({ 
      ok: true, 
      magicLink, 
      reviewId: newReview.id 
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// GET: Ver revisiones de un artículo 
// (Usado por el Panel para mostrar el historial)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const submissionId = url.searchParams.get("submissionId");

  if (!submissionId) return NextResponse.json({ ok: false, items: [] });

  const reviews = await prisma.reviewToken.findMany({
    where: { submissionId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ ok: true, items: reviews });
}

// PUT: Guardar la evaluación del experto
// (Usado por el Revisor desde el formulario público) -> ESTO ES LO NUEVO
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { token, verdict, feedback } = body;

    // Validación básica
    if (!token || !verdict) {
      return NextResponse.json({ ok: false, error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Buscar el token y verificar que exista
    const review = await prisma.reviewToken.findUnique({ where: { token } });
    
    if (!review) {
      return NextResponse.json({ ok: false, error: "Enlace inválido o caducado" }, { status: 404 });
    }

    // 2. Guardar la evaluación en la base de datos
    await prisma.reviewToken.update({
      where: { id: review.id },
      data: {
        status: "completado",
        verdict,     // 'aceptar', 'cambios', 'rechazar'
        feedback,    // Comentarios de texto
      },
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}