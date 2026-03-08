// src/app/api/admin/horarios/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "../../../../../auth"

async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const horarios = await prisma.horarioDisponible.findMany({ orderBy: { hora: "asc" } })
  return NextResponse.json(horarios)
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { hora } = await req.json()
  if (!hora) return NextResponse.json({ error: "Falta la hora" }, { status: 400 })
  const horario = await prisma.horarioDisponible.create({ data: { hora } })
  return NextResponse.json(horario, { status: 201 })
}