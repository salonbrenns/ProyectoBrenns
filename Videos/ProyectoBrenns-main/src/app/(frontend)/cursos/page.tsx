"use client"

import Image from "next/image"
import Link from "next/link"
import { Loader2, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import FilterSidebar from "@/components/ui/filter-sidebar"

type Curso = {
  id: number
  titulo: string
  precio_total: number
  nivel: string | null
  imagenes: string[] | null
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cargando, setCargando] = useState(true)

  const [busqueda, setBusqueda] = useState("")
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/cursos")
      .then(r => r.json())
      .then(data => {
        setCursos(data.cursos || [])
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  // 🔥 niveles dinámicos
  const nivelesDisponibles = Array.from(
    new Set(cursos.map(c => c.nivel).filter(Boolean))
  ) as string[]

  const toggleNivel = (nivel: string) => {
    setNivelesSeleccionados(prev =>
      prev.includes(nivel)
        ? prev.filter(n => n !== nivel)
        : [...prev, nivel]
    )
  }

  const limpiarFiltros = () => {
    setBusqueda("")
    setNivelesSeleccionados([])
  }

  // 🔥 filtros
  const cursosFiltrados = cursos
    .filter(c =>
      c.titulo.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter(
      c =>
        nivelesSeleccionados.length === 0 ||
        (c.nivel && nivelesSeleccionados.includes(c.nivel))
    )

  return (
    <main className="min-h-screen bg-[#fffafa] py-12">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 🔍 FILTROS */}
        <div className="mb-10">
          <FilterSidebar
            title="Filtrar cursos:"
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            categoriasSeleccionadas={nivelesSeleccionados}
            categoriasDisponibles={nivelesDisponibles}
            toggleCategoria={toggleNivel}
            limpiarFiltros={limpiarFiltros}
          />
        </div>

        {/* 🔄 Cargando */}
        {cargando && (
          <div className="flex flex-col items-center py-40">
            <Loader2 className="w-16 h-16 animate-spin text-pink-400" />
          </div>
        )}

        {/* 🧾 Cards */}
        {!cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {cursosFiltrados.map((curso) => {
              const imagen = curso.imagenes?.[0] || null

              return (
                <article
                  key={curso.id}
                  className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-pink-50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  <Link href={`/curso/${curso.id}`}>

                    {/* Imagen */}
                    <div className="relative h-64 bg-pink-50 overflow-hidden">
                      {imagen ? (
                        <Image
                          src={imagen}
                          alt={curso.titulo}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          🎓
                        </div>
                      )}

                      {/* Nivel badge */}
                      {curso.nivel && (
                        <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-1.5 rounded-full text-xs font-bold border">
                          {curso.nivel}
                        </div>
                      )}

                      {/* Favorito */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-pink-600 hover:text-white"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-1">
                        {curso.titulo}
                      </h3>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">
                          ${Number(curso.precio_total).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">MXN</span>
                      </div>
                    </div>

                  </Link>

                  {/* Botón */}
                  <div className="px-6 pb-6">
                    <Link href={`/curso/${curso.id}`}>
                      <button className="w-full bg-gray-900 hover:bg-pink-600 text-white font-bold py-3.5 rounded-2xl transition">
                        Ver Curso
                      </button>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* 🚫 Sin resultados */}
        {!cargando && cursosFiltrados.length === 0 && (
          <div className="text-center py-32">
            <p className="text-2xl font-bold">
              No encontramos cursos
            </p>
          </div>
        )}
      </div>
    </main>
  )
}