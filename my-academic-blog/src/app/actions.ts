"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registrarDescarga(slug: string) {
  if (!slug) return;

  try {
    // Busca el artículo por su slug y suma 1 a 'downloads'
    await prisma.postMetric.upsert({
      where: { slug },
      update: { downloads: { increment: 1 } },
      create: { slug, views: 0, downloads: 1 },
    });

    // Recarga la página para mostrar el nuevo número
    revalidatePath(`/posts/${slug}`);
    
  } catch (error) {
    console.error("Error registrando descarga:", error);
  }
}
