'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateMarcaForm() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [activa, setActiva] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔥 Aquí luego conectaremos con tu Server Action
    console.log({ nombre, descripcion, activa })

    router.push('/admin/categorias')
  }

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
      
      <h2 className="text-2xl font-bold text-pink-900 mb-6">
        Crear Nueva Categoría
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            placeholder="Ej: Fantasy"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            placeholder="Descripción opcional de la categoria"
          />
        </div>

        {/* Activa */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={activa}
            onChange={(e) => setActiva(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-pink-700 focus:ring-pink-600"
          />
          <label className="text-sm text-gray-700">
            Categoria activa
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/marcas')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-pink-700 px-5 py-2 text-sm font-medium text-white hover:bg-pink-800 transition"
          >
            Guardar Categoria
          </button>
        </div>
      </form>
    </div>
  )
}