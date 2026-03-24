import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Mantenemos el log solo si lo necesitas para depurar el entorno
console.log("RUNTIME DATABASE_URL:", process.env.DATABASE_URL)
const prisma = new PrismaClient()

export async function GET() {
  try {
    const marcas = await prisma.marca.findMany()
    return NextResponse.json(marcas)
  } catch {
    // CORRECCIÓN: Eliminamos (_error) para que el linter no se queje
    return NextResponse.json(
      { error: 'Error al obtener marcas' },
      { status: 500 }
    )
  }
}