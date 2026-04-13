'use client'

import { FiltroOpcion } from '@/app/admin/proyeccion/types'
interface Props {
  busqueda:      string
  categoriaId:   number | null
  marcaId:       number | null
  categorias:    FiltroOpcion[]
  marcas:        FiltroOpcion[]
  onBusqueda:    (v: string)        => void
  onCategoria:   (v: number | null) => void
  onMarca:       (v: number | null) => void
  onLimpiar:     ()                 => void
}

export default function FiltrosProyeccion({
  busqueda, categoriaId, marcaId, categorias, marcas,
  onBusqueda, onCategoria, onMarca, onLimpiar,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label className="text-xs font-medium text-gray-500">Buscar producto</label>
        <input
          type="text"
          placeholder="Nombre del producto..."
          value={busqueda}
          onChange={e => onBusqueda(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Categoría</label>
        <select
          value={categoriaId ?? ''}
          onChange={e => onCategoria(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Todas</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Marca</label>
        <select
          value={marcaId ?? ''}
          onChange={e => onMarca(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Todas</option>
          {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      <button
        onClick={onLimpiar}
        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        Limpiar
      </button>
    </div>
  )
}