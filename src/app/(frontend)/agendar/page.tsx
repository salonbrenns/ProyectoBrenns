// src/app/agendar/page.tsx
"use client"

import { useState } from "react"
import AuthGuard from "@/components/ui/AuthGuard"
import Breadcrumb from "@/components/Breadcrumb"
import { ChevronLeft, ChevronRight, Clock, Calendar, User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

const servicioSeleccionado = {
  nombre: "Manicure Clásica + Semipermanente",
  precio: 380,
  duracion: "60 min",
  profesional: "Primer disponible"
}

export default function AgendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const today = new Date(2025, 10, 21)
  const [currentMonth] = useState(today)

  const daysInMonth = Array.from({ length: 30 }, (_, i) => new Date(2025, 10, i + 1))

  const horariosManana = ["10:00 am", "10:30 am", "11:00 am", "11:30 am"]
  const horariosTarde = ["1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "4:00 pm", "5:00 pm"]

  return (
    <AuthGuard>
      {/* Reducimos pt-12 a pt-4 para que todo suba al tope */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Ultra-Compacto */}
          <div className="space-y-1 mb-4"> 
            <Link 
              href="/agendar" 
              className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold text-xs group"
            >
              
            </Link>
            <Breadcrumb items={[
              { label: "Servicios", href: "/servicios-publicas" },
              { label: "Agendar Cita", href: "#", active: true }
            ]} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Reducimos p-8 a p-5 o p-6 */}
              <div className="bg-white rounded-3xl shadow-xl p-5 md:p-7">
                
                {/* Título y pasos en la misma línea para ahorrar espacio vertical */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h1 className="text-xl font-bold text-pink-600">
                    Selecciona fecha y hora
                  </h1>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-pink-600 text-white text-xs font-bold shadow-sm">
                      1. Fecha y Hora
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                      2. Contacto
                    </span>
                  </div>
                </div>

                <div className="bg-pink-50/40 rounded-3xl p-5 border border-pink-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-pink-700 capitalize">
                      {format(currentMonth, "MMMM yyyy", { locale: es })}
                    </h2>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white rounded-full shadow-sm hover:bg-pink-100 transition border border-pink-100">
                        <ChevronLeft className="w-5 h-5 text-pink-600" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-sm hover:bg-pink-100 transition border border-pink-100">
                        <ChevronRight className="w-5 h-5 text-pink-600" />
                      </button>
                    </div>
                  </div>

                  {/* Calendario */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(d => (
                      <div key={d} className="text-pink-400 text-[10px] font-bold uppercase tracking-widest">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {daysInMonth.map((date, i) => {
                      const isPast = date < today
                      const isSelected = selectedDate?.toDateString() === date.toDateString()
                      return (
                        <button
                          key={i}
                          onClick={() => !isPast && setSelectedDate(date)}
                          disabled={isPast}
                          className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            isSelected
                              ? "bg-pink-600 text-white shadow-md scale-105"
                              : isPast
                              ? "text-gray-300 cursor-not-allowed"
                              : "bg-white hover:bg-pink-100 text-gray-700 border border-transparent hover:border-pink-200"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>

                  {/* Sección de Horarios */}
                  {selectedDate && (
                    <div className="mt-6 pt-6 border-t border-pink-100 animate-in fade-in zoom-in-95 duration-300">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-bold text-pink-600 mb-3 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Mañana
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {horariosManana.map(hora => (
                              <button
                                key={hora}
                                onClick={() => setSelectedTime(hora)}
                                className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                                  selectedTime === hora
                                    ? "bg-pink-600 text-white border-pink-600"
                                    : "bg-white border-pink-100 hover:border-pink-300 text-gray-600"
                                }`}
                              >
                                {hora}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-pink-600 mb-3 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Tarde
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {horariosTarde.map(hora => (
                              <button
                                key={hora}
                                onClick={() => setSelectedTime(hora)}
                                className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                                  selectedTime === hora
                                    ? "bg-pink-600 text-white border-pink-600"
                                    : "bg-white border-pink-100 hover:border-pink-300 text-gray-600"
                                }`}
                              >
                                {hora}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-4 border border-pink-50">
                <h3 className="text-lg font-bold text-pink-600 mb-4">Tu Cita</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{servicioSeleccionado.nombre}</h4>
                    <p className="text-pink-600 font-extrabold text-lg">${servicioSeleccionado.precio} MXN</p>
                  </div>
                  
                  <div className="space-y-3 px-1">
                    {selectedDate && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span className="font-medium">{format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <Clock className="w-4 h-4 text-pink-400" />
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    )}
                  </div>

                  {selectedDate && selectedTime && (
                    <Link
                      href={{ pathname: "/pago", query: { /* datos */ } }}
                      className="block pt-2"
                    >
                      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">
                        Confirmar y Pagar
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}