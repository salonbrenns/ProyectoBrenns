// src/app/(frontend)/servicio/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { Clock, Heart, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BotonAccion from "@/components/ui/BotonAccion"

export default async function DetalleServicio({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const servicio = await prisma.servicio.findUnique({
    where: { id: Number(id), activo: true },
  })

  if (!servicio) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/servicios" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mb-8">
          <ArrowLeft className="w-5 h-5" /> Volver a servicios
        </Link>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px] bg-pink-100">
            {servicio.imagen ? (
              <Image src={servicio.imagen} alt={servicio.nombre} width={800} height={800} className="object-cover w-full h-full" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <span className="text-9xl">✂️</span>
              </div>
            )}
            <button aria-label="Añadir a favoritos" className="absolute top-6 right-6 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white transition hover:scale-110">
              <Heart className="w-7 h-7 text-pink-600" />
            </button>
          </div>
          <div className="space-y-8">
            <div>
              <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold mb-4">{servicio.categoria}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{servicio.nombre}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <Clock className="w-6 h-6 text-pink-600" />
                <span className="text-xl font-medium">{servicio.duracion}</span>
              </div>
            </div>
            {servicio.descripcion && (
              <p className="text-xl text-gray-700 leading-relaxed">{servicio.descripcion}</p>
            )}
            <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-3xl p-8 text-center">
              <p className="text-5xl font-bold text-pink-600">
                ${Number(servicio.precio).toLocaleString()}
                <span className="text-2xl font-normal text-gray-600"> MXN</span>
              </p>
            </div>
            <BotonAccion
              tipo="agendar"
              href={`/agendar?servicioId=${servicio.id}`}
              textoLogueado="Agendar Cita Ahora"
              textoNoLogueado="Inicia sesión para agendar"
            />
          </div>
        </div>
      </div>
    </div>
  )
}