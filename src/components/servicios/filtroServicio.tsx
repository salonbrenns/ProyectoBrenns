// src/components/servicios/filtroServicio.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface ServicioFilterProps {
  categorias: string[]
}

export default function ServicioFilter({ categorias }: ServicioFilterProps) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // reset a página 1 al filtrar
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        defaultValue={searchParams.get('categoria') ?? ''}
        onChange={(e) => handleChange('categoria', e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}