import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CursoDetalle from "./CursoDetalle"

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  const curso = await prisma.curso.findUnique({
    where: {
      id: Number(params.id),
      activo: true,
    },
  })

  if (!curso) return notFound()

  return (
    <CursoDetalle
      curso={{
        ...curso,
        imagenes: (curso.imagenes as string[]) || [],
        fecha_inicio: curso.fecha_inicio?.toISOString() || null,
        fecha_fin: curso.fecha_fin?.toISOString() || null,
      }}
    />
  )
}