// src/app/servicio/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Clock, Heart, ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

// Base de datos de los 3 servicios de belleza
const servicios = {
  "1": {
    id: 1,
    nombre: "Manicure Clásica Semipermanente",
    precio: 380,
    duracion: "60 min",
    img: "/servicios/manicure.jpg",
    descripcion: "Manicure completo con esmaltado semipermanente de alta duración. Incluye corte, limado, empujado de cutícula, exfoliación e hidratación profunda.",
    incluye: [
      "Limpieza y preparación de uñas",
      "Esmaltado semipermanente (color a elegir)",
      "Exfoliación e hidratación de manos",
      "Masaje relajante",
      "Duración hasta 21 días"
    ],
    categoria: "Manicure"
  },
  "2": {
    id: 2,
    nombre: "Pedicure Spa + Gelish",
    precio: 480,
    duracion: "90 min",
    img: "/servicios/pedicure.jpg",
    descripcion: "Tratamiento completo de pedicure spa con sales, exfoliación profunda y esmaltado en gel de larga duración. Tus pies como nuevos.",
    incluye: [
      "Remojo relajante con sales del Himalaya",
      "Exfoliación profunda con azúcar y aceites",
      "Eliminación de callos y durezas",
      "Esmaltado Gelish (hasta 30 días)",
      "Masaje con crema hidratante",
      "Parafina caliente opcional (+$100)"
    ],
    categoria: "Pedicure"
  },
  "3": {
    id: 3,
    nombre: "Uñas AcryliGel + Diseño",
    precio: 850,
    duracion: "120 min",
    img: "/servicios/unas.jpg",
    descripcion: "Sistema híbrido AcryliGel: la fuerza del acrílico con la flexibilidad del gel. Diseño personalizado incluido (francés, baby boomer, glitter, etc.).",
    incluye: [
      "Aplicación completa de AcryliGel",
      "Forma a elegir (almendra, cuadrada, stiletto…)",
      "Diseño personalizado incluido",
      "Efectos 3D, encapsulado, cromado",
      "Duración hasta 4 semanas",
      "Mantenimiento cada 3 semanas recomendado"
    ],
    categoria: "Uñas"
  }
}

export default async function DetalleServicio({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const servicio = servicios[id as keyof typeof servicios]

  if (!servicio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600 mb-6">Servicio no encontrado</h1>
          <Link href="/servicios" className="text-pink-600 hover:underline text-lg inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Volver a servicios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Botón volver */}
        <Link href="/servicios" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mb-8">
          <ArrowLeft className="w-5 h-5" />
          Volver a servicios
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Imagen grande */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={servicio.img}
              alt={servicio.nombre}
              width={800}
              height={800}
              className="object-cover w-full h-full"
              priority
            />

            {/* BOTÓN DE FAVORITOS CORREGIDO (accesible) */}
            <button
              aria-label="Añadir a favoritos"
              className="absolute top-6 right-6 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
            >
              <Heart className="w-7 h-7 text-pink-600" />
            </button>
          </div>

          {/* Detalles */}
          <div className="space-y-10">
            <div>
              <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                {servicio.categoria}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {servicio.nombre}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <Clock className="w-6 h-6 text-pink-600" />
                <span className="text-xl font-medium">{servicio.duracion}</span>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              {servicio.descripcion}
            </p>

            {/* Precio */}
            <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-3xl p-8 text-center">
              <p className="text-5xl font-bold text-pink-600">
                ${servicio.precio}
                <span className="text-2xl font-normal text-gray-600"> MXN</span>
              </p>
            </div>

            {/* Qué incluye */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Qué incluye?</h2>
              <ul className="space-y-4">
                {servicio.incluye.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-7 h-7 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón Agendar */}
            <Link href="/agendar" className="block">
              <Button className="w-full h-20 text-xl font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-full shadow-2xl hover:shadow-pink-600/50 transition-all flex items-center justify-center gap-4">
                <Calendar className="w-7 h-7" />
                Agendar Cita Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}