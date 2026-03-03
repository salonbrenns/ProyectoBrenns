// src/app/catalogo/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, Heart, Filter, ChevronRight } from "lucide-react"
import { useState } from "react"

const productos = [
  { 
    id: 1, 
    nombre: "Esmalte Rosa Pastel", 
    precio: 15000, 
    categoria: "Nail Art", 
    marca: "Renova Matte", 
    oferta: true, 
    img: "/catalogo/Rojo.jpg",
    descripcion: "Un hermoso esmalte de color rojo que aporta un toque de elegancia a tus uñas. Su fórmula de larga duración asegura un acabado brillante y duradero.",
    rating: 4.5,
    reviews: 128
  },
  { 
    id: 2, 
    nombre: "Removedor Sin Acetona", 
    precio: 16000, 
    categoria: "Foot Care", 
    marca: "Brenn's Care", 
    oferta: false, 
    img: "/catalogo/renovador.jpg",
    descripcion: "Removedor suave sin acetona, ideal para uñas sensibles. No reseca ni debilita la uña natural.",
    rating: 4.8,
    reviews: 89
  },
  { 
    id: 3, 
    nombre: "Kit Manicura Profesional", 
    precio: 45000, 
    categoria: "Salon Pro", 
    marca: "Brenn's", 
    oferta: true, 
    img: "/catalogo/KIT.jpg",
    descripcion: "Kit completo con todo lo necesario para manicura profesional en casa o salón.",
    rating: 5.0,
    reviews: 203
  },
]

export default function CatalogoPage() {
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos")

  const categorias = ["Todos", "Nail Art", "Foot Care", "Salon Pro", "Acrílicos", "Geles", "Lámparas"]

  const productosFiltrados = productos
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.marca.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => categoriaSeleccionada === "Todos" || p.categoria === categoriaSeleccionada)

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-pink-600 mb-12">
          Catálogo de Productos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* FILTROS LATERALES */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100 sticky top-24">
              <div className="flex items-center gap-3 text-pink-600 mb-6 pb-4 border-b border-pink-100">
                <Filter className="w-6 h-6" />
                <h2 className="text-xl font-bold">Filtrar por:</h2>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:border-pink-500 focus:outline-none text-gray-700 placeholder-gray-400 shadow-sm"
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-pink-600 mb-4">Categoría</h3>
              <div className="space-y-3">
                {categorias.map(cat => (
                  <label key={cat} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="cat"
                        checked={categoriaSeleccionada === cat}
                        onChange={() => setCategoriaSeleccionada(cat)}
                        className="w-5 h-5 text-pink-600"
                      />
                      <span className={`font-medium ${categoriaSeleccionada === cat ? "text-pink-600 font-bold" : "text-gray-700 group-hover:text-pink-600"}`}>
                        {cat}
                      </span>
                    </div>
                    {categoriaSeleccionada === cat && <ChevronRight className="w-5 h-5 text-pink-600" />}
                  </label>
                ))}
              </div>

              <button
                onClick={() => { setBusqueda(""); setCategoriaSeleccionada("Todos") }}
                className="mt-10 w-full py-4 bg-pink-100 hover:bg-pink-200 text-pink-600 font-bold rounded-2xl transition"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <section className="lg:col-span-3">
            <p className="mb-8 text-gray-600 font-medium text-lg">
              Mostrando <strong>{productosFiltrados.length}</strong> de {productos.length} productos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {productosFiltrados.map(producto => (
                <article key={producto.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100 hover:shadow-2xl transition-all">
                  <Link href={`/producto/${producto.id}`}>
                    <div className="relative h-80 bg-gray-100 cursor-pointer">
                      {producto.oferta && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse z-10">
                          ¡OFERTA!
                        </div>
                      )}
                      <Image
                        src={producto.img}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition z-10">
                        <Heart className="w-6 h-6 text-pink-600" />
                      </button>
                    </div>
                  </Link>

                  <div className="p-8 bg-gradient-to-b from-pink-50 to-white">
                    <p className="text-pink-600 font-semibold">{producto.marca}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-4xl font-black text-pink-600 mt-6">
                      ${(producto.precio / 100).toFixed(2)}
                    </p>
                  </div>

                  <div className="px-8 pb-8">
                    <Link href={`/producto/${producto.id}`}>
                      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-5 rounded-full shadow-xl transition transform hover:scale-105">
                        Ver Detalle
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}