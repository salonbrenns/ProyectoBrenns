// src/app/mis-cursos/page.tsx
"use client"

import Link from "next/link"
import { Calendar, Clock, CheckCircle, ShoppingBag, User, ArrowRight } from "lucide-react"
import { useState } from "react"
import AuthGuard from "@/components/ui/AuthGuard"

export default function MisCursosPage() {
  const [pestana, setPestana] = useState("cursos")

  const cursos = [
    { id: 1, titulo: "Acrílico Escultural: Nivel Intermedio", fecha: "1 Dic 2025", estado: "En curso", progreso: 100 },
    { id: 2, titulo: "Gelish Artist: Nivel Avanzado", fecha: "10 Dic 2025", estado: "Próximo", progreso: 0 },
    { id: 3, titulo: "Nail Art Profesional", fecha: "15 Ago 2025", estado: "Completado", progreso: 100 },
  ]

  const citas = [
    { id: 1, servicio: "Manicure Clásica Semipermanente", fecha: "28 Nov 2025", hora: "11:00 AM", estado: "Confirmada" },
    { id: 2, servicio: "Pedicure Spa + Gelish", fecha: "15 Nov 2025", hora: "03:00 PM", estado: "Completada" },
  ]

  const compras = [
    { id: 1, producto: "Kit Acrílico Profesional Brenn's", fecha: "10 Nov 2025", precio: 1890 },
    { id: 2, producto: "Lámpara LED 48W", fecha: "05 Oct 2025", precio: 950 },
  ]

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Título */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-600">Mi Historial</h1>
          <p className="text-gray-600 mt-3 text-lg">Todo lo que has hecho en Brenn's está aquí ♡</p>
        </header>

        {/* Pestañas */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["cursos", "citas", "compras"].map((tab) => (
            <button
              key={tab}
              onClick={() => setPestana(tab)}
              className={`px-8 py-4 rounded-full font-bold text-lg transition ${
                pestana === tab
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-pink-200 hover:bg-pink-50"
              }`}
            >
              {tab === "cursos" && "Mis Cursos"}
              {tab === "citas" && "Mis Citas"}
              {tab === "compras" && "Mis Compras"}
            </button>
          ))}
        </div>

        {/* Contenido según pestaña */}
        <div className="space-y-6">

          {/* CURSOS */}
          {pestana === "cursos" && (
            <div className="grid gap-6">
              {cursos.map((curso) => (
                <div key={curso.id} className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100 hover:shadow-2xl transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{curso.titulo}</h3>
                      <div className="flex items-center gap-4 mt-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-pink-600" />
                          <span>{curso.fecha}</span>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          curso.estado === "Completado" ? "bg-green-100 text-green-700" :
                          curso.estado === "En progreso" ? "bg-yellow-100 text-yellow-700" :
                          "bg-pink-100 text-pink-700"
                        }`}>
                          {curso.estado}
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    {curso.progreso > 0 && curso.progreso < 100 && (
                      <div className="w-full sm:w-48">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progreso</span>
                          <span className="font-bold text-pink-600">{curso.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-1000"
                            style={{ width: `${curso.progreso}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Link href={`/curso/${curso.id}`}>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition">
                        Ver curso <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CITAS */}
          {pestana === "citas" && (
            <div className="grid gap-6">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{cita.servicio}</h3>
                      <div className="flex items-center gap-6 mt-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-pink-600" />
                          <span>{cita.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-pink-600" />
                          <span>{cita.hora}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-5 py-2 rounded-full font-bold text-sm ${
                      cita.estado === "Completada" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"
                    }`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMPRAS */}
          {pestana === "compras" && (
            <div className="grid gap-6">
              {compras.map((compra) => (
                <div key={compra.id} className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 border-2 border-dashed rounded-2xl" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{compra.producto}</h3>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-pink-600" />
                        {compra.fecha}
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-pink-600">${compra.precio.toLocaleString()} MXN</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer bonito */}
        <div className="text-center mt-16">
          <p className="text-2xl text-gray-700">
            ¡Gracias por ser parte de la familia Brenn's, Ruth! ♡
          </p>
        </div>
        </div>
      </main>
    </AuthGuard>
  )
}