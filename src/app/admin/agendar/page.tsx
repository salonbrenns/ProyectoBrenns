// src/app/admin/agendar/page.tsx
import { Metadata } from 'next'
import CitasTable from '@/components/citas/table'
import Search from '@/components/search'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Citas',
  description: 'Administración de citas del salón',
}

export default async function AgendarAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; estado?: string }>
}) {
  const params = await searchParams

  const page   = Number(params.page) || 1
  const query  = params.query        || ''
  const take   = 10
  const skip   = (page - 1) * take

  const where: any = {}

  if (query) {
    where.OR = [
      { usuario: { nombre: { contains: query, mode: 'insensitive' } } },
      { servicio: { nombre: { contains: query, mode: 'insensitive' } } },
    ]
  }

  const totalCitas = await prisma.cita.count({ where })

  const citasRaw = await prisma.cita.findMany({
    where,
    select: {
      id:      true,
      fecha:   true,
      hora:    true,
      estado:  true,
      notas:   true,
      usuario: { select: { nombre: true, correo: true } },
      servicio:{ select: { nombre: true } },
    },
    orderBy: { fecha: 'desc' },
    take,
    skip,
  })

  // Serializar fechas para el client component
  const citas = citasRaw.map(c => ({
    ...c,
    fecha: c.fecha.toISOString(),
  }))

  const totalPages = Math.max(1, Math.ceil(totalCitas / take))

  // Conteo por estado para el resumen
  const [pendientes, confirmadas, completadas, canceladas] = await Promise.all([
    prisma.cita.count({ where: { estado: 'PENDIENTE' } }),
    prisma.cita.count({ where: { estado: 'CONFIRMADA' } }),
    prisma.cita.count({ where: { estado: 'COMPLETADA' } }),
    prisma.cita.count({ where: { estado: 'CANCELADA' } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-900">Citas / Agendar</h1>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pendientes',  value: pendientes,  color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Confirmadas', value: confirmadas, color: 'bg-blue-50   border-blue-200   text-blue-700'   },
          { label: 'Completadas', value: completadas, color: 'bg-green-50  border-green-200  text-green-700'  },
          { label: 'Canceladas',  value: canceladas,  color: 'bg-red-50    border-red-200    text-red-700'    },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border p-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Search placeholder="Buscar por cliente o servicio..." />
      </div>

      <CitasTable
  citas={citas as any}
  estadoFiltro={params.estado || ''}
  fechaFiltro={''}
/>
    </div>
  )
}