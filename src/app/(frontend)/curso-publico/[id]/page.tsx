// src/app/curso-publico/[id]/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Clock, Heart, User, BarChart3, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/Breadcrumb"

const cursos = {
  "1": {
    id: 1,
    titulo: "Acrílico Escultural: Nivel Intermedio",
    instructora: "Brenda García",
    nivel: "Intermedio",
    duracion: "4 semanas",
    precio: 2500,
    img: "/cursos/curso-aclirico.jpg",
    cupos: 3,
    descripcion: "Domina las técnicas avanzadas de acrílico escultural. Aprenderás a crear diseños 3D, formas estructuradas y efectos profesionales.",
    requisitos: [
      "Conocimientos básicos de uñas acrílicas",
      "Tener herramientas de base (limas, alicate)",
      "Mayor a 18 años"
    ],
    incluye: [
      "8 clases prácticas en vivo",
      "Material de estudio digital",
      "Certificado de participación",
      "Acceso a comunidad privada",
      "Soporte personalizado",
      "Videos grabados de las clases"
    ],
    horario: "Jueves y sábado de 2:00 PM a 5:00 PM",
    ubicacion: "Brenn's Academia, Huejutla de Reyes, Hidalgo",
    proximo: "15 de febrero de 2026"
  },
  "2": {
    id: 2,
    titulo: "Gelish Artist: Nivel Avanzado",
    instructora: "Brenda Garcia",
    nivel: "Avanzado",
    duracion: "3 semanas",
    precio: 3200,
    img: "/cursos/curso-gelish.jpg",
    cupos: 5,
    descripcion: "Conviértete en un experto en esmaltado gel. Domina técnicas de encapsulado, efectos especiales y diseños personalizados.",
    requisitos: [
      "Experiencia previa con gel",
      "Disponer de lámpara LED o UV",
      "Mayor a 18 años"
    ],
    incluye: [
      "6 clases prácticas intensivas",
      "Kit de geles de prueba",
      "Material de estudio avanzado",
      "Certificado profesional",
      "Mentorías personalizadas",
      "Acceso a catálogo de diseños"
    ],
    horario: "Lunes a viernes de 10:00 AM a 1:00 PM",
    ubicacion: "Brenn's Academia, Huejutla de Reyes, Hidalgo",
    proximo: "22 de febrero de 2026"
  },
  "3": {
    id: 3,
    titulo: "Manicure Clásica Semipermanente",
    instructora: "Brenda Garcia",
    nivel: "Principiante",
    duracion: "1 día",
    precio: 380,
    img: "/cursos/curso-nail.jpg",
    cupos: 15,
    descripcion: "Curso introductorio perfecto para aprender los fundamentos del esmaltado semipermanente.",
    requisitos: [
      "Mayor a 16 años",
      "Básicos de higiene y seguridad"
    ],
    incluye: [
      "4 horas de enseñanza práctica",
      "Material de estudio",
      "Certificado de participación",
      "Acceso a grupo WhatsApp de alumnos"
    ],
    horario: "Sábado de 9:00 AM a 1:00 PM",
    ubicacion: "Brenn's Academia, Huejutla de Reyes, Hidalgo",
    proximo: "1 de marzo de 2026"
  }
}

export default function CursoPublicoDetalle({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = (params as any)
  const curso = cursos[id as keyof typeof cursos]
  const router = useRouter()

  const handleInscribirse = () => {
    // Redirigir a login si no está autenticado
    router.push("/login")
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600 mb-6">Curso no encontrado</h1>
          <Link href="/cursos-publicos" className="text-pink-600 hover:underline text-lg inline-flex items-center gap-2">
            Volver a cursos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <Breadcrumb items={[
          { label: "Cursos", href: "/cursos-publicos" },
          { label: curso.titulo, href: "#", active: true }
        ]} />

        <div className="grid lg:grid-cols-2 gap-12">

          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={curso.img}
              alt={curso.titulo}
              width={800}
              height={800}
              className="object-cover w-full h-full"
              priority
            />

            <button
              aria-label="Añadir a favoritos"
              className="absolute top-6 right-6 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white transition hover:scale-110"
            >
              <Heart className="w-7 h-7 text-pink-600" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold">
                  {curso.nivel}
                </span>
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                  {curso.duracion}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {curso.titulo}
              </h1>
              <div className="flex items-center gap-3 text-gray-600 mb-2">
                <User className="w-6 h-6 text-pink-600" />
                <span className="text-lg font-medium">{curso.instructora}</span>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              {curso.descripcion}
            </p>

            <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-3xl p-8 text-center">
              <p className="text-5xl font-bold text-pink-600">
                ${curso.precio.toLocaleString()}
                <span className="text-2xl font-normal text-gray-600"> MXN</span>
              </p>
            </div>

            <button
              onClick={handleInscribirse}
              className="w-full h-16 text-xl font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-full shadow-2xl transition-all"
            >
              Inicia Sesión para Inscribirte
            </button>

            {/* Información adicional */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">Horario</p>
                  <p className="text-gray-700">{curso.horario}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">Ubicación</p>
                  <p className="text-gray-700">{curso.ubicacion}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <BarChart3 className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">Próxima Entrada</p>
                  <p className="text-gray-700">{curso.proximo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones de detalles */}
        <div className="grid md:grid-cols-2 gap-10 mt-20">

          {/* Requisitos */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">Requisitos</h2>
            <ul className="space-y-4">
              {curso.requisitos.map((req, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-pink-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Incluye */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">¿Qué Incluye?</h2>
            <ul className="space-y-4">
              {curso.incluye.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-pink-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Banner de inscripción */}
        <div className="mt-20 bg-gradient-to-r from-pink-600 to-pink-700 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">¿Listo para aprender?</h2>
          <p className="text-xl text-pink-100 mb-8">Cupos limitados - Únicamente {curso.cupos} lugares disponibles</p>
          <button
            onClick={handleInscribirse}
            className="bg-white text-pink-600 font-bold px-10 py-4 rounded-full hover:bg-pink-50 transition-all text-lg shadow-lg"
          >
            Inscribirme Ahora
          </button>
        </div>
      </div>
    </div>
  )
}
