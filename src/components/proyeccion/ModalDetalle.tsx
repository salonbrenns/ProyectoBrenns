'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { ProductoFila, PeriodoVenta, primeraImagen, formatearPeriodo  } from '@/app/admin/proyeccion/types'

interface Props {
  producto: ProductoFila
  onClose:  () => void
}

export default function ModalDetalle({ producto, onClose }: Props) {
  const [granularidad, setGranularidad] = useState<'dia' | 'semana' | 'mes'>('semana')
  const [vista,        setVista]        = useState<'tabla' | 'grafica'>('tabla')
  const [historico,    setHistorico]    = useState<PeriodoVenta[]>([])
  const [loading,      setLoading]      = useState(true)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/proyeccion?granularidad=${granularidad}&filtro=producto&filtro_id=${producto.id}&periodos_adelante=0`)
      const d = await r.json()
      setHistorico(d.historico ?? [])
    } catch {
      // error silencioso
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [granularidad, producto.id])

  const img = primeraImagen(producto.imagen)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-lg">{producto.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{producto.categoria} · {producto.marca}</p>
          </div>
          <div className="flex items-center gap-3">
            {img && (
              <Image src={img} alt={producto.nombre} width={56} height={56}
                className="rounded-lg object-cover h-14 w-14 flex-shrink-0" />
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {(['dia', 'semana', 'mes'] as const).map(g => (
                <button key={g} onClick={() => setGranularidad(g)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    granularidad === g ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {g === 'dia' ? 'Por Día' : g === 'semana' ? 'Por Semana' : 'Por Mes'}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {(['tabla', 'grafica'] as const).map(v => (
                <button key={v} onClick={() => setVista(v)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    vista === v ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {v === 'tabla' ? 'Tabla' : 'Gráfica'}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-700">
            Ventas por {granularidad === 'dia' ? 'Día' : granularidad === 'semana' ? 'Semana' : 'Mes'}
          </p>

          {loading && <p className="text-center text-gray-400 py-6 text-sm">Cargando...</p>}

          {!loading && historico.length === 0 && (
            <p className="text-center text-gray-400 py-6 text-sm">Sin ventas registradas</p>
          )}

          {!loading && historico.length > 0 && vista === 'tabla' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase">
                  <th className="text-left py-2">Periodo</th>
                  <th className="text-right py-2">Unidades vendidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historico.map(h => (
                  <tr key={h.periodo} className="hover:bg-gray-50">
                    <td className="py-2.5 font-mono text-gray-600">{formatearPeriodo(h.periodo)}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">{h.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && historico.length > 0 && vista === 'grafica' && (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={historico.map(h => ({ ...h, periodo: formatearPeriodo(h.periodo) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} uds`, 'Ventas']} />
                <Bar dataKey="total" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}