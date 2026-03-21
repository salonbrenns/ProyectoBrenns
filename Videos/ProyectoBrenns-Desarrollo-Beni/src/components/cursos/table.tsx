'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import ToggleCurso from './ToggleCurso'

interface Curso {
  id: number
  codigo: string
  titulo: string
  descripcion: string | null
  precio_total: number
  cupo_maximo: number
  duracion_horas: number | null
  nivel: string | null
  fecha_inicio: Date | null
  fecha_fin: Date | null
  activo: boolean
  imagenes: string[]
}

export default function CursoTable({
  cursos,
  totalPages,
  currentPage,
}: {
  cursos: Curso[]
  totalPages: number
  currentPage: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('query', term)
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  const formatDate = (date: Date | null) =>
    date ? new Date(date).toISOString().slice(0, 10) : ''

  return (
    <div className="space-y-4">

      {/* BUSCADOR */}
      <input
        placeholder="Buscar cursos..."
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      {/* BOTÓN */}
      <div className="flex justify-between">
        <Link
          href="/admin/cursos/create"
          className="bg-pink-700 text-white px-4 py-2 rounded"
        >
          <PlusIcon className="w-5 h-5 inline" /> Nuevo Curso
        </Link>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full">

          <thead className="bg-pink-900 text-white text-sm">
            <tr>
              <th className="p-3">Img</th>
              <th className="p-3">Código</th>
              <th className="p-3">Título</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Cupo</th>
              <th className="p-3">Duración</th>
              <th className="p-3">Nivel</th>
              <th className="p-3">Inicio</th>
              <th className="p-3">Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cursos.map((c) => (
              <tr key={c.id} className="border-b hover:bg-pink-50">

                <td className="p-3">
                  {c.imagenes?.[0] ? (
                    <img src={c.imagenes[0]} className="w-12 h-12 rounded object-cover" />
                  ) : <div className="w-12 h-12 bg-gray-200 rounded" />}
                </td>

                <td className="p-3">{c.codigo}</td>
                <td className="p-3">{c.titulo}</td>
                <td className="p-3">${c.precio_total}</td>
                <td className="p-3">{c.cupo_maximo}</td>
                <td className="p-3">{c.duracion_horas}</td>
                <td className="p-3">{c.nivel}</td>
                <td className="p-3">{formatDate(c.fecha_inicio)}</td>
                <td className="p-3">{formatDate(c.fecha_fin)}</td>

                <td className="p-3">
                  <ToggleCurso
                    id={c.id}
                    nombre={c.titulo ?? ''}
                    activo={c.activo}
                  />
                </td>

                <td className="p-3 text-right">
                  <Link href={`/admin/cursos/editar/${c.id}`}>
                    <PencilIcon className="w-4 h-4 text-green-700" />
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Link
          href={`?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded border ${
            currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Anterior
        </Link>

        <span>Página {currentPage} de {totalPages}</span>

        <Link
          href={`?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded border ${
            currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Siguiente
        </Link>
      </div>

    </div>
  )
}