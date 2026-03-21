import { prisma } from '@/lib/prisma'
import CursoForm from '@/components/cursos/form'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  const curso = await prisma.curso.findUnique({
    where: { id: Number(params.id) },
  })

  if (!curso) return notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-900">Editar Curso</h1>

      <CursoForm
        curso={{
          ...curso,
          precio_total: Number(curso.precio_total),

          imagenes: Array.isArray(curso.imagenes)
            ? (curso.imagenes as string[])
            : [],

          fecha_inicio: curso.fecha_inicio
            ? curso.fecha_inicio.toISOString().slice(0, 10)
            : '',

          fecha_fin: curso.fecha_fin
            ? curso.fecha_fin.toISOString().slice(0, 10)
            : '',
        }}
      />
    </div>
  )
}