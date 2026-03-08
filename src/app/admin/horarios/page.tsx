// src/app/admin/horarios/page.tsx
import { Metadata } from 'next'
import HorariosTable from '@/components/horarios/table'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Horarios disponibles',
  description: 'Configuración de horarios para citas',
}

export default async function HorariosPage() {
  const horarios = await prisma.horarioDisponible.findMany({
    orderBy: { hora: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pink-900">Horarios disponibles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define qué horas pueden reservar los clientes
          </p>
        </div>
      </div>

      <HorariosTable horarios={horarios} />
    </div>
  )
}