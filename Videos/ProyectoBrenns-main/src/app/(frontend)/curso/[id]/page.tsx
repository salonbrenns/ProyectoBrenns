import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CursoDetalle from "./CursoDetalle"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const curso = await prisma.curso.findUnique({
    where: {
      id: Number(id),
      activo: true,
    },
  })

  if (!curso) return notFound()

  return (
    <CursoDetalle
      curso={{
        ...curso,
        precio_total: Number(curso.precio_total), // ✅ FIX
        imagenes: (curso.imagenes as string[]) || [],
        fecha_inicio: curso.fecha_inicio?.toISOString() || null,
        fecha_fin: curso.fecha_fin?.toISOString() || null,
      }}
    />
  )
}