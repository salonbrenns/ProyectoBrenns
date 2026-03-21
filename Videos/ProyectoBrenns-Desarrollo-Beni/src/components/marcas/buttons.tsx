'use client'

import Link from 'next/link'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState, useTransition } from 'react'
import { deleteMarca } from '@/lib/actionsMarcas'

export function CreateMarca() {
  return (
    <Link
      href="/admin/marcas/create"
      className="inline-flex items-center gap-2 rounded-lg bg-pink-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-800 transition"
    >
      <PlusIcon className="h-5 w-5" />
      Nueva Marca
    </Link>
  )
}

export function UpdateMarca({ id }: { id: number }) {
  return (
    <Link
      href={`/admin/marcas/${id}/edit`}
      className="rounded-md p-2 hover:bg-green-100 transition"
      title="Editar marca"
    >
      <PencilIcon className="h-4 w-4 text-green-700" />
    </Link>
  )
}

export function DeleteMarca({
  id,
  nombre,
}: {
  id: number
  nombre: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-red-100 transition"
        title="Eliminar marca"
      >
        <TrashIcon className="h-4 w-4 text-red-700" />
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirmar eliminación
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              ¿Deseas eliminar la marca{' '}
              <span className="font-medium text-gray-800">
                {/* CORRECCIÓN: Usamos &quot; para las comillas */}
                &quot;{nombre}&quot;
              </span>? <br />
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  startTransition(async () => {
                    await deleteMarca(id)
                    setOpen(false)
                  })
                }}
                disabled={isPending}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}