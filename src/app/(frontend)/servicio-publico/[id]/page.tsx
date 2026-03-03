// src/app/servicio-publico/[id]/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Clock, Heart, Calendar } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

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

export default function ServicioPublicoDetalle({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = (params as any)
  const servicio = servicios[id as keyof typeof servicios]
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth] = useState(new Date(2025, 10, 21))

  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    return new Date(2025, 10, i + 1)
  })

  const horariosManana = ["10:00 am", "10:30 am", "11:00 am", "11:30 am"]
  const horariosTarde = ["1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "4:00 pm", "5:00 pm"]

  const handleAgendarClick = () => {
    // Redirigir a login si no está autenticado
    router.push("/login")
  }

  if (!servicio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600 mb-6">Servicio no encontrado</h1>
          <Link href="/servicios-publicas" className="text-pink-600 hover:underline text-lg inline-flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            Volver a servicios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <Breadcrumb items={[
          { label: "Servicios", href: "/servicios-publicas" },
          { label: servicio.nombre, href: "#", active: true }
        ]} />

        <div className="grid lg:grid-cols-2 gap-12">

          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={servicio.img}
              alt={servicio.nombre}
              width={800}
              height={800}
              className="object-cover w-full h-full"
              priority
            />

            <button
              aria-label="Añadir a favoritos"
              className="absolute top-6 right-6 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
            >
              <Heart className="w-7 h-7 text-pink-600" />
            </button>
          </div>

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

            <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-3xl p-8 text-center">
              <p className="text-5xl font-bold text-pink-600">
                ${servicio.precio}
                <span className="text-2xl font-normal text-gray-600"> MXN</span>
              </p>
            </div>

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

            <button
              onClick={handleAgendarClick}
              className="w-full h-20 text-xl font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-full shadow-2xl hover:shadow-pink-600/50 transition-all flex items-center justify-center gap-4"
            >
              <Calendar className="w-7 h-7" />
              Ver disponibilidad y Agendar
            </button>
          </div>
        </div>

        {/* SECCIÓN DE CALENDARIO PÚBLICO - Solo para ver */}
        <div className="mt-20 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-8">Consulta disponibilidad</h2>
          <p className="text-gray-600 mb-6 text-lg">Puedes ver nuestros horarios disponibles. <strong>Inicia sesión para agendar tu cita.</strong></p>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Calendario */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-pink-600">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h3>
                <div className="flex gap-3">
                  <button
                    aria-label="Mes anterior"
                    className="p-3 bg-pink-100 rounded-full hover:bg-pink-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-pink-600" />
                  </button>
                  <button
                    aria-label="Mes siguiente"
                    className="p-3 bg-pink-100 rounded-full hover:bg-pink-200"
                  >
                    <ChevronRight className="w-6 h-6 text-pink-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 text-center mb-6">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
                  <div key={d} className="text-gray-500 font-medium">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3 text-center">
                {daysInMonth.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`p-4 rounded-xl font-bold transition ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Horarios */}
            <div>
              {selectedDate ? (
                <div>
                  <p className="text-gray-600 mb-4 font-medium">
                    Seleccionaste: <strong>{format(selectedDate, "dd MMM yyyy", { locale: es })}</strong>
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Por la Mañana</p>
                      <div className="grid grid-cols-2 gap-2">
                        {horariosManana.map(hora => (
                          <button
                            key={hora}
                            onClick={() => setSelectedTime(hora)}
                            className={`p-2 rounded-lg text-sm font-bold transition ${
                              selectedTime === hora
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                            }`}
                          >
                            {hora}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Por la Tarde</p>
                      <div className="grid grid-cols-2 gap-2">
                        {horariosTarde.map(hora => (
                          <button
                            key={hora}
                            onClick={() => setSelectedTime(hora)}
                            className={`p-2 rounded-lg text-sm font-bold transition ${
                              selectedTime === hora
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                            }`}
                          >
                            {hora}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-pink-50 rounded-xl">
                  <p className="text-gray-600 font-medium">Selecciona una fecha</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-blue-800 font-medium text-center">
              ✨ Debes iniciar sesión para confirmar tu cita. <br />
              <strong>Haz clic en "Ver disponibilidad y Agendar" arriba para continuar.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
