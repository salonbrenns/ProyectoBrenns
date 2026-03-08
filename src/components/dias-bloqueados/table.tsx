'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

type DiaBloqueado = {
  id: number
  fecha: string
  motivo: string | null
}

export default function DiasBloqueadosTable({ dias }: { dias: DiaBloqueado[] }) {
  const router = useRouter()
  const [fecha,      setFecha]      = useState('')
  const [motivo,     setMotivo]     = useState('')
  const [agregando,  setAgregando]  = useState(false)
  const [eliminando, setEliminando] = useState<number | null>(null)
  const [error,      setError]      = useState('')

  const agregar = async () => {
    if (!fecha) { setError('Selecciona una fecha'); return }
    setAgregando(true)
    setError('')
    const res = await fetch('/api/admin/dias-bloqueados', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ fecha, motivo }),
    })
    if (res.ok) { setFecha(''); setMotivo(''); router.refresh() }
    else setError('Error al agregar. ¿Ya existe esa fecha?')
    setAgregando(false)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desbloquear esta fecha?')) return
    setEliminando(id)
    await fetch(`/api/admin/dias-bloqueados/${id}`, { method: 'DELETE' })
    router.refresh()
    setEliminando(null)
  }

  return (
    <div className="space-y-6">

      {/* Agregar */}
      <div className="bg-pink-50 rounded-xl p-5 border border-pink-100 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Bloquear una fecha</p>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => { setFecha(e.target.value); setError('') }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-400"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-600 mb-1">Motivo (opcional)</label>
            <input
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ej: Día festivo, vacaciones..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-400"
            />
          </div>
          <button
            onClick={agregar}
            disabled={agregando}
            className="inline-flex items-center gap-2 rounded-lg bg-pink-700 px-4 py-2 text-sm font-medium text-white hover:bg-pink-800 transition disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
            {agregando ? 'Agregando...' : 'Bloquear fecha'}
          </button>
        </div>
        {error && <p className="text-red-600 text-xs">{error}</p>}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-pink-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Motivo</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dias.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">
                  No hay fechas bloqueadas
                </td>
              </tr>
            ) : dias.map(d => {
              const fecha = new Date(d.fecha).toLocaleDateString('es-MX', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC'
              })
              return (
                <tr key={d.id} className="hover:bg-pink-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4 text-pink-400" />
                      <span className="text-sm font-medium text-gray-900 capitalize">{fecha}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {d.motivo || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => eliminar(d.id)}
                      disabled={eliminando === d.id}
                      className="rounded-md p-2 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4 text-red-700" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}