"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function RecuperarContraseñaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Validar formato de email
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validar campo vacío
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    // Validar formato de email
    if (!validarEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    setLoading(true)

    try {
      // TODO: Reemplazar con tu endpoint real de recuperación de contraseña
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Error al procesar tu solicitud")
      }

      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        {/* Lado Izquierdo: Branding */}
        <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="z-10 relative">
            <div className="mb-8 flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
              <span className="text-xl font-bold tracking-wide">Brenn's</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Recupera tu <br />
              <span className="text-pink-200">Acceso</span>
            </h1>

            <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
              Te enviaremos instrucciones para resetear tu contraseña en tu correo electrónico.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Mensaje de Éxito */}
        <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo Enviado!</h2>
              <p className="text-gray-600">
                Hemos enviado instrucciones de recuperación de contraseña a:
              </p>
              <p className="font-bold text-pink-600 mt-2">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p>Por favor revisa tu bandeja de entrada y spam. El enlace es válido por 24 horas.</p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => window.location.href = "/login"}
                className="w-full bg-pink-600 text-white py-3 rounded-full font-bold hover:bg-pink-700 transition-all"
              >
                Volver a Iniciar Sesión
              </button>

              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                Intentar con otro correo
              </button>
            </div>

            <p className="text-sm text-gray-600">
              ¿No recibiste el correo?{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-pink-600 font-bold hover:underline"
              >
                Intenta de nuevo
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Lado Izquierdo: Branding */}
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn's</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Recupera tu <br />
            <span className="text-pink-200">Contraseña</span>
          </h1>

          <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
            Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Recuperar Contraseña</h2>
          <p className="text-gray-500 text-center mb-8">Ingresa tu correo para recibir instrucciones</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 w-5 h-5 text-pink-600 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full pl-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Instrucciones"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6 space-y-4">
            <p className="text-sm text-gray-600">
              ¿Recuerdas tu contraseña?{" "}
              <Link href="/login" className="text-pink-600 font-bold hover:text-pink-800 hover:underline transition-colors">
                Inicia sesión
              </Link>
            </p>

            <Link href="/register" className="block text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <span className="text-pink-600 font-bold hover:text-pink-800">Regístrate aquí</span>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold text-sm">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
