// src/app/api/servicios/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const servicio = await prisma.servicio.findUnique({
    where: { id: Number(id), activo: true },
    select: {
      id:       true,
      nombre:   true,
      precio:   true,
      duracion: true,
      imagen:   true,
    },
  })

  if (!servicio) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    ...servicio,
    precio: Number(servicio.precio),
  })
}
