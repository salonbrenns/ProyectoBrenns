import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true,
        precio_venta: true,
        stock: true,
        activo: true,
        imagen: true,
        categoria: {
          select: {
            nombre: true
          }
        },
        marca: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    return NextResponse.json(productos)

  } catch {
    // CORRECCIÓN: Se eliminó (_error) para limpiar la advertencia del linter
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}