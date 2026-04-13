// src/app/(frontend)/servicio/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Layers } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BotonAccion from "@/components/ui/BotonAccion"
import DetalleTabs from "@/components/ui/DetalleTabs"
import {FavoritoServicioBoton}from "@/components/ui/FavoritoServicioBoton"

export default async function DetalleServicio({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const servicio = await prisma.servicio.findUnique({
    where: { id: Number(id), activo: true },
    include: { categoria: { select: { nombre: true } } },
  }) as {
    id: number; nombre: string; descripcion: string | null
    precio: number; duracion: string; activo: boolean
    categoria: { nombre: string } | null
    imagen: string | null; beneficios: string | null; incluye: string | null
  } | null

  if (!servicio) return notFound()

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link href="/servicios"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 font-semibold text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a todos los servicios
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Imagen sticky */}
          <div className="lg:sticky lg:top-8">
            <div className="relative rounded-3xl overflow-hidden bg-pink-50 shadow-xl aspect-square">
              {servicio.imagen ? (
                <Image src={servicio.imagen} alt={servicio.nombre} fill
                  sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">✨</div>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-1.5 rounded-full font-bold shadow-sm text-xs border border-pink-100">
                <Clock className="w-3.5 h-3.5 text-pink-600" />
                {servicio.duracion}
              </div>

              {/* Corazón — esquina superior derecha sobre la imagen */}
              <div className="absolute top-4 right-4">
                <FavoritoServicioBoton
                  servicioId={servicio.id}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              {servicio.categoria && (
                <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  <Layers className="w-3 h-3" /> {servicio.categoria.nombre}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {servicio.nombre}
            </h1>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-pink-100">
              <p className="text-4xl font-black text-gray-900">
                ${Number(servicio.precio).toLocaleString('es-MX')}
                <span className="text-lg font-semibold text-gray-400 ml-2">MXN</span>
              </p>
            </div>

            <DetalleTabs
              descripcion={servicio.descripcion || ""}
              beneficios={servicio.beneficios   || ""}
              incluye={servicio.incluye         || ""}
            />

            <BotonAccion
              tipo="agendar"
              href={`/agendar?servicioId=${servicio.id}`}
              textoLogueado="Agendar Cita Ahora"
              textoNoLogueado="Inicia sesión para agendar"
            />

            <Link href="/servicios"
              className="block text-center text-sm text-gray-400 hover:text-pink-600 transition-colors font-medium">
              ← Ver todos los servicios
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}