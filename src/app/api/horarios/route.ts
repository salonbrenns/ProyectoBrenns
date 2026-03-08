// src/app/api/horarios/route.ts
// GET /api/horarios?fecha=2026-03-15&servicioId=1
// Devuelve horarios activos menos los ya reservados para esa fecha

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fecha      = searchParams.get("fecha")
  const servicioId = searchParams.get("servicioId")

  if (!fecha) {
    return NextResponse.json({ error: "Falta la fecha" }, { status: 400 })
  }

  const horarios = await prisma.horarioDisponible.findMany({
    where: { activo: true },
    orderBy: { hora: "asc" },
  })

  const fechaInicio = new Date(`${fecha}T00:00:00.000Z`)
  const fechaFin    = new Date(`${fecha}T23:59:59.999Z`)

  const citasOcupadas = await prisma.cita.findMany({
    where: {
      fecha:  { gte: fechaInicio, lte: fechaFin },
      estado: { not: "CANCELADA" },
      ...(servicioId ? { servicio_id: Number(servicioId) } : {}),
    },
    select: { hora: true },
  })

  const horasOcupadas = new Set(citasOcupadas.map(c => c.hora))

  return NextResponse.json(
    horarios.map(h => ({
      id:         h.id,
      hora:       h.hora,
      disponible: !horasOcupadas.has(h.hora),
    }))
  )
}