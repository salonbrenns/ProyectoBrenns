// src/app/api/admin/citas/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "../../../../../../auth"

async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const { id }   = await params
  const { estado } = await req.json()

  const cita = await prisma.cita.update({
    where: { id: Number(id) },
    data:  { estado },
  })
  return NextResponse.json({ ok: true, cita })
}