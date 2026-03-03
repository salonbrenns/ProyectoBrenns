// src/app/pago/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Breadcrumb from "@/components/Breadcrumb"
import { CreditCard, Lock, CheckCircle, ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import AuthGuard from "@/components/ui/AuthGuard"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { validarInscripcion } from "@/lib/validation"

export default function PagoPage() {
  const searchParams = useSearchParams()

  const cita = {
    servicio: searchParams.get("servicio") || "Servicio seleccionado",
    precio: Number(searchParams.get("precio")) || 0,
    fecha: searchParams.get("fecha") ? new Date(searchParams.get("fecha")!) : new Date(),
    hora: searchParams.get("hora") || "No seleccionada",
    duracion: searchParams.get("duracion") || "60 min",
    profesional: "Primer disponible"
  }

  const [formData, setFormData] = useState({
    nombre: "", apellido: "", correo: "", nombreTarjeta: "", telefono: "", numeroTarjeta: "", expiracion: "", cvv: ""
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError(null)

    const validacion = validarInscripcion(formData)
    if (!validacion.valido) {
      setFieldErrors(validacion.errores)
      setGeneralError("Por favor completa correctamente todos los campos")
      return
    }

    alert("¡Cita agendada con éxito! Te esperamos en Brenn's")
    window.location.href = "/servicios"
  }

  return (
    <AuthGuard>
      {/* Reducimos el padding superior drásticamente de pt-12 a pt-4 */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Compacto: Volver + Breadcrumb */}
          <div className="flex flex-col gap-1 mb-6">
  
            <Breadcrumb items={[
              { label: "Agendar", href: "/agendar" },
              { label: "Pago", href: "#", active: true }
            ]} />
          </div>

          <h1 className="sr-only">Pago seguro - Brenn's Nails</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario de pago */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                
                {/* Indicador de pasos compacto */}
                <div className="flex gap-3 mb-8">
                  <div className="px-5 py-2 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">1. Fecha y Hora</div>
                  <div className="px-5 py-2 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md">2. Contacto y Pago</div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Nombre y Apellido */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                      <input id="nombre" name="nombre" onChange={handleChange} 
                        className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-all ${
                          fieldErrors.nombre ? "border-red-500" : "border-pink-100 focus:border-pink-500"
                        }`}
                        placeholder="Ruth" />
                    </div>
                    <div>
                      <label htmlFor="apellido" className="block text-sm font-bold text-gray-700 mb-1">Apellido</label>
                      <input id="apellido" name="apellido" onChange={handleChange} 
                        className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-all ${
                          fieldErrors.apellido ? "border-red-500" : "border-pink-100 focus:border-pink-500"
                        }`}
                        placeholder="Barrientos" />
                    </div>
                  </div>

                  {/* Correo y Teléfono */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="correo" className="block text-sm font-bold text-gray-700 mb-1">Correo electrónico</label>
                      <input id="correo" type="email" name="correo" onChange={handleChange} 
                        className={`w-full px-5 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-500 focus:outline-none`}
                        placeholder="ejemplo@correo.com" />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                      <input id="telefono" name="telefono" onChange={handleChange} 
                        className={`w-full px-5 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-500 focus:outline-none`}
                        placeholder="961 123 4567" />
                    </div>
                  </div>

                  {/* Tarjeta */}
                  <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 space-y-4">
                    <h3 className="font-bold text-pink-700 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Datos de la tarjeta
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <input name="numeroTarjeta" onChange={handleChange} maxLength={19} 
                          className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-pink-500 focus:outline-none shadow-sm"
                          placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input name="expiracion" onChange={handleChange} placeholder="MM/AA" className="w-full px-3 py-3 rounded-xl border-2 border-white focus:outline-none shadow-sm" />
                        <input name="cvv" onChange={handleChange} placeholder="CVV" className="w-full px-3 py-3 rounded-xl border-2 border-white focus:outline-none shadow-sm" />
                      </div>
                    </div>
                  </div>

                

                  {/* Botón de pago */}
                  <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Confirmar Reserva (${cita.precio} MXN)
                  </button>
                </form>
              </div>
            </div>

            {/* Resumen lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-4 border border-pink-100">
                <h2 className="text-lg font-bold text-pink-600 mb-4">Resumen de Cita</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50 rounded-2xl">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{cita.servicio}</h3>
                    <p className="text-pink-600 font-extrabold text-xl">${cita.precio} MXN</p>
                  </div>
                  
                  <div className="space-y-3 px-1 text-sm text-gray-600">
                    <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-pink-400" /><span>{format(cita.fecha, "PPP", { locale: es })}</span></div>
                    <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-pink-400" /><span>{cita.hora} ({cita.duracion})</span></div>
                    <div className="flex items-center gap-3"><User className="w-4 h-4 text-pink-400" /><span>{cita.profesional}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}