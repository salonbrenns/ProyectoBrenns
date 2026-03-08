// src/app/admin/dias-bloqueados/page.tsx
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import DiasBloqueadosTable from '@/components/dias-bloqueados/table'

export const metadata: Metadata = {
  title: 'Días bloqueados',
  description: 'Fechas sin servicio',
}

export default async function DiasBloqueadosPage() {
  const dias = await prisma.diaBloqueado.findMany({
    orderBy: { fecha: 'asc' },
  })

  const diasSerialized = dias.map(d => ({
    ...d,
    fecha:     d.fecha.toISOString(),
    createdAt: d.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pink-900">Días bloqueados</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fechas en las que no habrá servicio disponible
        </p>
      </div>
      <DiasBloqueadosTable dias={diasSerialized} />
    </div>
  )
}