// src/app/(frontend)/servicios/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import FilterSidebar from '@/components/ui/filter-sidebar'

type Servicio = {
  id: number
  nombre: string
  precio: number
  categoria: string
  imagen: string | null
  duracion: string
}

export default function ServiciosPage() {
  const [serviciosData, setServiciosData]             = useState<Servicio[]>([])
  const [cargando, setCargando]                       = useState(true)
  const [busqueda, setBusqueda]                       = useState("")
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([])

  // Cargar servicios desde la BD
  useEffect(() => {
    fetch("/api/servicios")
      .then(r => r.json())
      .then(data => {
        setServiciosData(data.servicios || [])
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  const categoriasDisponibles = Array.from(new Set(serviciosData.map(s => s.categoria)))

  const toggleCategoria = (categoria: string) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(categoria) ? prev.filter(c => c !== categoria) : [...prev, categoria]
    )
  }

  const limpiarFiltros = () => {
    setBusqueda("")
    setCategoriasSeleccionadas([])
  }

  const serviciosFiltrados = serviciosData
    .filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(s => categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(s.categoria))

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-6">
            Conoce de nuestros Servicios
          </h1>
        </header>

        <div className="grid lg:grid-cols-4 gap-10">

          <aside aria-label="Filtros de servicios" className="lg:col-span-1">
            <FilterSidebar
              title="Filtrar por:"
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              categoriasSeleccionadas={categoriasSeleccionadas}
              categoriasDisponibles={categoriasDisponibles}
              toggleCategoria={toggleCategoria}
              limpiarFiltros={limpiarFiltros}
            />
          </aside>

          <section aria-label="Lista de servicios disponibles" className="lg:col-span-3">

            {/* Cargando */}
            {cargando && (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="w-12 h-12 text-pink-400 animate-spin" />
              </div>
            )}

            {/* Grid de servicios */}
            {!cargando && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviciosFiltrados.map((servicio) => (
                  <article key={servicio.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100 transition-all hover:shadow-2xl">
                    <Link href={`/servicio/${servicio.id}`} aria-label={`Ver detalle de ${servicio.nombre}`}>
                      <div className="cursor-pointer">
                        <div className="relative h-72 overflow-hidden bg-pink-100">
                          {servicio.imagen ? (
                            <Image
                              src={servicio.imagen}
                              alt={`Fotografía de ${servicio.nombre}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                              quality={80}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">✂️</span>
                            </div>
                          )}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Agregar ${servicio.nombre} a favoritos`}
                            className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
                          >
                            <Heart className="w-6 h-6 text-pink-600" />
                          </button>
                          <div className="absolute bottom-4 left-4 bg-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-lg text-sm">
                            {servicio.duracion}
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-b from-pink-50 to-white">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {servicio.nombre}
                          </h3>
                          <p className="text-3xl font-bold text-pink-600">
                            ${Number(servicio.precio).toLocaleString()}
                            <span className="text-lg font-normal text-gray-700"> MXN</span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 pb-6">
                      <Link href={`/servicio/${servicio.id}`}>
                        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-full transition shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-95">
                          Ver Detalle
                        </button>
                      </Link>
                    </div>
                  </article>
                ))}

                {/* Sin resultados */}
                {serviciosFiltrados.length === 0 && (
                  <div className="lg:col-span-3 text-center py-20 bg-white/50 rounded-xl mt-10 shadow-lg border border-pink-100">
                    <p className="text-2xl font-semibold text-gray-600">
                      🙁 No se encontraron servicios con los filtros aplicados.
                    </p>
                    <button
                      onClick={limpiarFiltros}
                      className="mt-4 text-pink-600 font-bold hover:underline"
                    >
                      Mostrar todos los servicios
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <footer className="text-center mt-16">
          <p className="text-gray-700 text-lg">
            ¿Quieres ver más servicios? Pronto agregaremos más opciones
          </p>
        </footer>
      </div>
    </main>
  )
}