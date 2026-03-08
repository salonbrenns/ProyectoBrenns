// src/app/admin/servicios/editar/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicioForm from '@/components/servicios/form'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Editar Servicio' }

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const servicio = await prisma.servicio.findUnique({
    where: { id: Number(id) },
  })

  if (!servicio) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-900">Editar Servicio</h1>
      <ServicioForm
        servicio={{
          ...servicio,
          precio: Number(servicio.precio),
          descripcion: servicio.descripcion ?? '',
          imagen: servicio.imagen ?? '',
        }}
      />
    </div>
  )
}