'use client'

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Servicio {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  duracion: string
  categoria: string
  imagen: string | null
  activo: boolean
}

interface Props {
  servicios: Servicio[]
  currentPage: number
  totalPages: number
}

const columns = [
  { label: 'Nombre',      key: 'nombre' },
  { label: 'Categoría',   key: 'categoria' },
  { label: 'Duración',    key: 'duracion' },
  { label: 'Precio',      key: 'precio' },
  { label: 'Estado',      key: 'activo' },
]

export default function ServicioTable({ servicios, currentPage, totalPages }: Props) {
  const searchParams  = useSearchParams()
  const pathname      = usePathname()
  const { replace }   = useRouter()
  const [eliminando, setEliminando] = useState<number | null>(null)

  const sort      = searchParams.get('sort')      || 'nombre'
  const direction = searchParams.get('direction') || 'asc'

  const handleSort = (column: string) => {
    const params        = new URLSearchParams(searchParams)
    const newDirection  = column === sort && direction === 'asc' ? 'desc' : 'asc'
    params.set('sort', column)
    params.set('direction', newDirection)
    replace(`${pathname}?${params.toString()}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return
    setEliminando(id)
    const res = await fetch(`/api/admin/servicios/${id}`, { method: 'DELETE' })
    if (res.ok) {
      replace(pathname)
    } else {
      alert('Error al eliminar el servicio')
    }
    setEliminando(null)
  }

  return (
    <div className="mt-6 space-y-4">

      {/* Botón Crear */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/servicios/create"
          className="inline-flex items-center gap-2 rounded-lg bg-pink-700 px-4 py-2 text-sm font-medium text-white hover:bg-pink-800 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Servicio
        </Link>
      </div>

      {/* Tabla */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">

          {/* HEADER */}
          <thead className="bg-pink-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sort === col.key && (
                      direction === 'asc'
                        ? <ArrowUpIcon className="h-4 w-4" />
                        : <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white divide-y divide-gray-200">
            {servicios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                  No hay servicios registrados
                </td>
              </tr>
            ) : (
              servicios.map((s) => (
                <tr key={s.id} className="hover:bg-pink-50 transition-colors">

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {s.nombre}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                      {s.categoria}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {s.duracion}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${Number(s.precio).toFixed(2)} MXN
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/servicios/editar/${s.id}`}
                        className="rounded-md p-2 hover:bg-green-100 transition"
                      >
                        <PencilIcon className="h-4 w-4 text-green-700" />
                      </Link>

                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={eliminando === s.id}
                        className="rounded-md p-2 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Link
          href={`?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded-lg border ${
            currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'
          }`}
        >
          Anterior
        </Link>
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <Link
          href={`?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded-lg border ${
            currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}