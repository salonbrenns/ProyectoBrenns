// src/hooks/useFavoritosServicios.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

// ─── Tipos ────────────────────────────────────────────────────────────────────
// Espeja exactamente la forma que devuelve GET /api/favoritos-servicios
export interface FavoritoServicioItem {
  id:          number
  servicio_id: number
  servicio: {
    id:         number
    nombre:     string
    imagen:     unknown
    categoria:  string | null
    precio_min: number
    disponible: boolean
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFavoritosServicios() {
  const { status } = useSession()
  const [favoritos, setFavoritos] = useState<FavoritoServicioItem[]>([])
  const [cargando, setCargando]   = useState(false)

  // Carga la lista desde la API (idéntico a useFavoritos, distinto endpoint)
  const cargar = useCallback(async () => {
    if (status !== 'authenticated') return
    setCargando(true)
    try {
      const res = await fetch('/api/favoritos-servicios')
      if (res.ok) setFavoritos(await res.json())
    } finally {
      setCargando(false)
    }
  }, [status])

  useEffect(() => { cargar() }, [cargar])

  // Toggle: agrega si no está, elimina si ya está
  const toggle = useCallback(async (servicio_id: number) => {
    const res = await fetch('/api/favoritos-servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servicio_id }),
    })
    if (res.ok) await cargar()
    return res.ok
  }, [cargar])

  const esFavorito = useCallback(
    (servicio_id: number) => favoritos.some(f => f.servicio_id === servicio_id),
    [favoritos]
  )

  return { favoritos, cargando, toggle, esFavorito }
}