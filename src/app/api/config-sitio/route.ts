// src/app/api/config-sitio/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const registros = await prisma.configSitio.findMany()
    const config = Object.fromEntries(registros.map(r => [r.clave, r.valor]))
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}