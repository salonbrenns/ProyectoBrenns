// src/app/perfil/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Calendar, Mail, Phone, MapPin, Edit2, LogOut, Heart, Clock, CreditCard } from "lucide-react"
import AuthGuard from "@/components/ui/AuthGuard"
import Breadcrumb from "@/components/Breadcrumb"

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState({
    nombre: "Cargando...",
    correo: "cargando...",
    telefono: "+52 961 123 4567",
    miembroDesde: "Cargando...",
    nivel: "Estudiante PRO",
    cursosInscritos: 3,
    citasPendientes: 2,
    favoritos: 8,
  })
  const [primerLetra, setPrimerLetra] = useState("U")

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    if (typeof window !== "undefined") {
      const nombre = localStorage.getItem("user_nombre") || "Usuario"
      const correo = localStorage.getItem("user_email") || "correo@ejemplo.com"
      const fecha = localStorage.getItem("user_fecha") || "Recientemente"

      setUsuario(prev => ({
        ...prev,
        nombre,
        correo,
        miembroDesde: fecha
      }))
      setPrimerLetra(nombre.charAt(0).toUpperCase())
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_email")
      localStorage.removeItem("user_nombre")
      localStorage.removeItem("user_fecha")
      sessionStorage.removeItem("auth_active")
      // Disparar evento para que el Header se actualice
      window.dispatchEvent(new Event("auth-changed"))
    }
    router.push("/login")
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Mi Perfil", href: "#", active: true }
        ]} />

        {/* Header del perfil */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 border border-pink-100">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-5xl sm:text-6xl font-bold shadow-xl">
                {primerLetra}
              </div>
              <button className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition">
                <Edit2 className="w-5 h-5 text-pink-600" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{usuario.nombre}</h1>
              <p className="text-pink-600 font-bold text-lg mt-2">{usuario.nivel}</p>
              <p className="text-gray-600 mt-1">Miembro desde {usuario.miembroDesde}</p>
            </div>

            <div className="flex gap-4">
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105">
                Editar Perfil
              </button>
        
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Columna izquierda - Info personal */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100">
              <h2 className="text-xl font-bold text-pink-600 mb-6">Información Personal</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-pink-600" />
                  <div className="break-all">
                    <p className="text-sm text-gray-600">Correo</p>
                    <p className="font-medium text-sm">{usuario.correo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{usuario.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <p className="font-medium">Huejutla de Reyes, Hidalgo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl shadow-xl p-6 text-center">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-pink-600">{usuario.favoritos}</p>
              <p className="text-gray-700 font-medium">Favoritos</p>
            </div>
          </div>

          {/* Columna derecha - Actividad */}
          <div className="md:col-span-2 space-y-8">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-pink-100">
                <Calendar className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{usuario.cursosInscritos}</p>
                <p className="text-gray-600">Cursos inscritos</p>
              </div>
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-pink-100">
                <Clock className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{usuario.citasPendientes}</p>
                <p className="text-gray-600">Citas pendientes</p>
              </div>
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-pink-100">
                <CreditCard className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-gray-600">Compras totales</p>
              </div>
            </div>

            {/* Mis cursos */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
              <h2 className="text-2xl font-bold text-pink-600 mb-6">Mis Cursos Activos</h2>
              <div className="space-y-4">
                <Link href="/curso/1" className="block p-6 bg-pink-50 rounded-2xl hover:bg-pink-100 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Acrílico Escultural: Nivel Intermedio</h3>
                      <p className="text-pink-600">Inicia 19 de Octubre • Brenda García</p>
                    </div>
                    <div className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Activo
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                ¿Quieres ver todos tus cursos y citas?{" "}
                <Link href="/mis-cursos" className="text-pink-600 font-bold hover:underline">
                  Ir a Mi Historial →
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
    </AuthGuard>
  )
}