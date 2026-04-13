// src/app/api/horarios/route.ts
// GET — devuelve horarios disponibles para una fecha
// Si viene empleado_id, filtra solo días que ese empleado atiende

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fecha      = searchParams.get("fecha")       // "2025-04-15"
  const empleadoId = searchParams.get("empleadoId")  // opcional

  if (!fecha) return NextResponse.json([], { status: 400 })

  const fechaDate  = new Date(fecha + "T00:00:00")
  // getDay(): 0=Dom,1=Lun,...,6=Sáb → convertir a 1=Lun,...,6=Sáb
  const diaSemanaJS = fechaDate.getDay()
  const diaSemana   = diaSemanaJS === 0 ? 7 : diaSemanaJS // 7=Domingo (sin servicio)

  // Si hay empleado seleccionado, verificar que atiende ese día
  if (empleadoId && empleadoId !== "null") {
  const atiende = await prisma.empleadoDia.findUnique({
  where: {
    usuario_id_dia_semana: {
      usuario_id: Number(empleadoId),
      dia_semana: diaSemana,
    },
  },
})

    // El empleado no atiende ese día → devolver vacío con mensaje
    if (!atiende) {
      return NextResponse.json({ sinAtencion: true, horarios: [] })
    }
  }

  // Obtener horas bloqueadas para esa fecha
  const [horasBloqueadas, citasDelDia, horarioExcepcion] = await Promise.all([
    prisma.horaBloqueada.findMany({ where: { fecha: fechaDate } }),
    prisma.cita.findMany({
      where: {
        fecha: fechaDate,
        estado: { notIn: ["CANCELADO"] },
        ...(empleadoId && empleadoId !== "null"
          ? { empleado_id: Number(empleadoId) }
          : {}),
      },
      select: { hora: true },
    }),
    prisma.horarioExcepcion.findMany({ where: { fecha: fechaDate } }),
  ])

  const horasOcupadas = new Set([
    ...horasBloqueadas.map(h => h.hora),
    ...citasDelDia.map(c => c.hora),
    ...horarioExcepcion.map(h => h.hora),
  ])

  // Obtener horarios del día
  const horariosBase = await prisma.horarioDisponible.findMany({
    where: { diaSemana: diaSemana, activo: true },
    orderBy: { hora: "asc" },
  })

  const horarios = horariosBase.map(h => ({
    id:         h.id,
    hora:       h.hora,
    disponible: !horasOcupadas.has(h.hora),
  }))

  return NextResponse.json({ sinAtencion: false, horarios })
}