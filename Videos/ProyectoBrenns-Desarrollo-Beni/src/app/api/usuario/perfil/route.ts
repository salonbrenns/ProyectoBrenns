// src/app/api/usuario/perfil/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "../../../../../auth"

const prisma = new PrismaClient()

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { nombre, correo, telefono } = await req.json()

    if (!nombre || !correo) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 })
    }

    // Verificar si el correo ya lo usa otro usuario
    if (correo !== session.user.email) {
      const existente = await prisma.usuario.findUnique({ where: { correo } })
      if (existente && existente.id !== Number(session.user.id)) {
        return NextResponse.json({ error: "Este correo ya está en uso" }, { status: 409 })
      }
    }

    const actualizado = await prisma.usuario.update({
      where: { id: Number(session.user.id) },
      data: {
        nombre,
        correo,
        telefono: telefono || null,
      },
    })

    return NextResponse.json({
      ok: true,
      user: {
        nombre: actualizado.nombre,
        correo: actualizado.correo,
        telefono: actualizado.telefono,
      },
    })
  } catch (err) {
    console.error("Error actualizando perfil:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}