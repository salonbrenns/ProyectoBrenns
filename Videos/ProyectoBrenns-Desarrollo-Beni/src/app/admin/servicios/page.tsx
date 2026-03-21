// src/app/admin/servicios/page.tsx
import { Metadata } from 'next'
import ServicioTable from '@/components/servicios/table'
import Search from '@/components/search'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Administración de servicios del salón',
}

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>
}) {
  const params = await searchParams

  const page  = Number(params.page)  || 1
  const query = params.query         || ''
  const take  = 10
  const skip  = (page - 1) * take

  const where = query
    ? {
        OR: [
          { nombre:    { contains: query, mode: 'insensitive' as const } },
          { categoria: { contains: query, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const totalServicios = await prisma.servicio.count({ where })

  const serviciosRaw = await prisma.servicio.findMany({
    where,
    select: {
      id:          true,
      nombre:      true,
      descripcion: true,
      precio:      true,
      duracion:    true,
      categoria:   true,
      imagen:      true,
      activo:      true,
    },
    orderBy: { id: 'asc' },
    take,
    skip,
  })

  const servicios = serviciosRaw.map((s) => ({
    ...s,
    precio: Number(s.precio),
  }))

  const totalPages = Math.max(1, Math.ceil(totalServicios / take))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-900">Servicios</h1>
      </div>

      <div className="flex items-center gap-4">
        <Search placeholder="Buscar servicios..." />
      </div>

      <ServicioTable
        servicios={servicios}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}