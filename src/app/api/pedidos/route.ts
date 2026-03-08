// src/app/api/pedidos/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "../../../../auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { items, subtotal, costo_envio, total, nombre_cliente, correo_cliente, telefono_cliente } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    // Crear pedido con sus detalles
    const pedido = await prisma.pedido.create({
      data: {
        usuario_id: Number(session.user.id),
        subtotal,
        costo_envio,
        total,
        nombre_cliente,
        correo_cliente,
        telefono_cliente: telefono_cliente || null,
        detalles: {
          create: items.map((item: any) => ({
            producto_id: item.id,
            nombre_producto: item.nombre,
            precio_unitario: item.precio / 100, // convertir de centavos
            cantidad: item.cantidad,
            subtotal: (item.precio * item.cantidad) / 100,
          })),
        },
      },
      include: { detalles: true },
    })

    return NextResponse.json({ ok: true, pedido_id: pedido.id })
  } catch (err) {
    console.error("Error creando pedido:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Obtener pedidos del usuario autenticado
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const pedidos = await prisma.pedido.findMany({
      where: { usuario_id: Number(session.user.id) },
      include: { detalles: true },
      orderBy: { fecha_pedido: "desc" },
    })

    return NextResponse.json({ pedidos })
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}