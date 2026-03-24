// src/app/api/servicios/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    
  } catch (_err) { // <--- Cambia 'err' por '_err' o simplemente quítalo
    console.error("Error obteniendo servicio:", _err) // Opcional: usarlo para debug
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}