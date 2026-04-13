// src/hooks/usePermisos.ts
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function usePermisos() {
  const { data: session } = useSession()
  const [permisos, setPermisos] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!session) return
    fetch("/api/auth/mis-permisos")
      .then(r => r.json())
      .then(data => {
        setPermisos(Array.isArray(data) ? data : [])
        setCargando(false)
      })
  }, [session])

  const puede = (key: string) => {
    if (session?.user?.rol === "ADMIN") return true // admin puede todo
    return permisos.includes(key)
  }

  return { puede, cargando, permisos }
}