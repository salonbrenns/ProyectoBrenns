import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password , telefono} = await req.json()

    // Validaciones básicas
    if (!name || !email || !password || !telefono) {
      return NextResponse.json(
        { error: "Nombre, correo y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: email },
    })

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo" },
        { status: 409 }
      )
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 12)

    // Crear usuario con rol CLIENTE por defecto
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: name,
        correo: email,
        password: passwordHash,
        telefono: telefono,
        rol: "CLIENTE",
      },
    })

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          telefono: nuevoUsuario.telefono,
          rol: nuevoUsuario.rol,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}