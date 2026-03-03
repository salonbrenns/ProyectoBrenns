"use client"
import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { validarLogin } from "@/lib/validation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Validar formulario
    const validacion = validarLogin({ email, password })
    if (!validacion.valido) {
      setFieldErrors(validacion.errores)
      setError("Por favor completa correctamente todos los campos")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error en login")

      // Guardar token y datos del usuario en localStorage (demo)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user_email", data.user.email)
        localStorage.setItem("user_nombre", data.user.nombre)
        localStorage.setItem("user_fecha", data.user.fechaRegistro)
        // Marcar que la sesión se inició en esta pestaña / sesión
        sessionStorage.setItem("auth_active", "1")
        // Disparar evento para que el Header se actualice
        window.dispatchEvent(new Event("auth-changed"))
      }

      // Redirigir al destino original si existe `next`
      const next = searchParams?.get("next")
      if (next) {
        try {
          const decoded = decodeURIComponent(next)
          router.push(decoded)
          return
        } catch (e) {
          // fallback
        }
      }

      router.push("/perfil")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Lado Izquierdo: Branding (Consistente con Registro) */}
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn's</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Bienvenida <br />
            <span className="text-pink-200">de Nuevo</span>
          </h1>
          
          <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
            Accede a tu cuenta para continuar aprendiendo, gestionar tus citas o comprar material de la mejor calidad.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario de Login */}
      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 text-center mb-8">Ingresa tus credenciales para entrar</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  fieldErrors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                <Link href="/recuperar-contraseña" className="text-xs text-pink-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
              )}
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
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta?{" "}
              <Link href="/register" className="text-pink-600 font-bold hover:text-pink-800 hover:underline transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}