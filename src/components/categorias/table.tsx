'use client'

import Link from 'next/link'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

// Renombramos a Categoria para que coincida con el componente
export interface Categoria {
  id: string | number // Aceptamos ambos por si la DB usa números o UUIDs
  nombre: string
}

export default function CategoriaTable({ categorias }: { categorias: Categoria[] }) {
  return (
    <div className="space-y-4">
      {/* Botón crear */}
      <div className="flex justify-end">
        <Link
          href="/admin/categorias/create"
          className="inline-flex items-center gap-2 rounded-lg bg-pink-700 px-4 py-2 text-sm font-medium text-white hover:bg-pink-800 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva Categoria
        </Link>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-pink-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Nombre</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-500">
                  No hay categorias registradas
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{categoria.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/categorias/editar/${categoria.id}`}
                        className="rounded-md p-2 hover:bg-green-100"
                      >
                        <PencilIcon className="h-4 w-4 text-green-700" />
                      </Link>

                      <button className="rounded-md p-2 hover:bg-red-100">
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
    </div>
  )
}