'use client'

import { CreateMarca, UpdateMarca, DeleteMarca } from '../marcas/buttons'
import { Marca } from '@prisma/client'   

export default function MarcaTable({ marcas }: { marcas: Marca[] }) {
  return (
    <div className="space-y-4">
      
      <div className="flex justify-end">
        <CreateMarca />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-pink-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {marcas.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-500">
                  No hay marcas registradas
                </td>
              </tr>
            ) : (
              marcas.map((marca) => (
                <tr key={marca.id} className="hover:bg-pink-50 transition">
                  <td className="px-6 py-4 text-sm">{marca.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {marca.nombre}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <UpdateMarca id={marca.id} />
                      <DeleteMarca id={marca.id} nombre={marca.nombre} />
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