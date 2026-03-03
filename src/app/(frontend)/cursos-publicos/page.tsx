// src/app/cursos-publicos/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Search, Heart, User } from "lucide-react"
import { useState } from "react"
import FilterSidebar from '@/components/ui/filter-sidebar'

const cursosData = [
  { id: 1, titulo: "Acrílico Escultural: Nivel Intermedio", instructora: "Brenda García", nivel: "Intermedio", duracion: "4 semanas", precio: 2500, img: "/cursos/curso-aclirico.jpg", cupos: 3 },
  { id: 2, titulo: "Gelish Artist: Nivel Avanzado", instructora: "Brenda Garcia", nivel: "Avanzado", duracion: "3 semanas", precio: 3200, img: "/cursos/curso-gelish.jpg", cupos: 5 },
  { id: 3, titulo: "Manicure Clásica Semipermanente", instructora: "Brenda Garcia", nivel: "Principiante", duracion: "1 día", precio: 380, img: "/cursos/curso-nail.jpg", cupos: 15 },
]

export default function CursosPublicosPage() {
    const [busqueda, setBusqueda] = useState("")
    const [nivelesSeleccionados, setNivelesSeleccionados] = useState<string[]>([])

    const nivelesDisponibles = Array.from(new Set(cursosData.map(c => c.nivel)));

    const toggleNivel = (nivel: string) => {
        setNivelesSeleccionados(prev => 
            prev.includes(nivel) 
                ? prev.filter(n => n !== nivel)
                : [...prev, nivel]
        );
    };

    const limpiarFiltros = () => {
        setBusqueda("");
        setNivelesSeleccionados([]);
    };

    const cursosFiltrados = cursosData
        .filter(c => c.titulo.toLowerCase().includes(busqueda.toLowerCase()) || c.instructora.toLowerCase().includes(busqueda.toLowerCase()))
        .filter(c => {
            if (nivelesSeleccionados.length === 0) return true;
            return nivelesSeleccionados.includes(c.nivel);
        });

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-16">
            <div className="max-w-7xl mx-auto px-6">

                <header className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-6">
                        Cursos de Belleza
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Aprende las técnicas más demandadas de la industria con nuestros cursos profesionales
                    </p>
                </header>

                <div className="grid lg:grid-cols-4 gap-10">

                    <aside aria-label="Filtros de cursos" className="lg:col-span-1">
                        <FilterSidebar
                            title="Filtrar por:"
                            busqueda={busqueda}
                            setBusqueda={setBusqueda}
                            categoriasSeleccionadas={nivelesSeleccionados}
                            categoriasDisponibles={nivelesDisponibles}
                            toggleCategoria={toggleNivel}
                            limpiarFiltros={limpiarFiltros}
                        />
                    </aside>

                    <section aria-label="Lista de cursos disponibles" className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cursosFiltrados.map((curso) => (
                                <article key={curso.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100 transition-all hover:shadow-2xl">
                                    <Link href={`/curso-publico/${curso.id}`} aria-label={`Ver detalle del curso ${curso.titulo}`}>
                                        <div className="cursor-pointer">
                                            <div className="relative h-72 overflow-hidden bg-gray-100">
                                                <Image
                                                    src={curso.img}
                                                    alt={`Curso: ${curso.titulo}`}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    loading="lazy"
                                                    quality={80}
                                                />
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label={`Agregar ${curso.titulo} a favoritos`}
                                                    className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition z-10"
                                                >
                                                    <Heart className="w-6 h-6 text-pink-600" />
                                                </button>
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    <span className="bg-pink-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                                                        {curso.nivel}
                                                    </span>
                                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                                                        {curso.duracion}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-gradient-to-b from-pink-50 to-white">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {curso.titulo}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                    <User className="w-5 h-5 text-pink-600" />
                                                    <p className="text-sm">{curso.instructora}</p>
                                                </div>
                                                <p className="text-3xl font-bold text-pink-600">
                                                    ${curso.precio.toLocaleString()}
                                                    <span className="text-lg font-normal text-gray-700"> MXN</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="px-6 pb-6">
                                        <Link href={`/curso-publico/${curso.id}`}>
                                            <button
                                                aria-label={`Ver detalle completo del curso ${curso.titulo}`}
                                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-full transition shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-95"
                                            >
                                                Ver Detalle
                                            </button>
                                        </Link>
                                    </div>
                                </article>
                            ))}

                            {cursosFiltrados.length === 0 && (
                                <div className="lg:col-span-3 text-center py-20 bg-white/50 rounded-xl mt-10 shadow-lg border border-pink-100">
                                    <p className="text-2xl font-semibold text-gray-600">
                                        🙁 No se encontraron cursos con los filtros aplicados.
                                    </p>
                                    <button 
                                        onClick={limpiarFiltros}
                                        className="mt-4 text-pink-600 font-bold hover:underline transition-colors"
                                    >
                                        Mostrar todos los cursos
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <footer className="text-center mt-16">
                    <p className="text-gray-700 text-lg">
                        ¿Necesitas más información? Contáctanos para detalles adicionales
                    </p>
                </footer>
            </div>
        </main>
    )
}
