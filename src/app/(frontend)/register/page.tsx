"use client"
import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { validarRegistro, validarContraseña } from "@/lib/validation"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  })

  // Validar requisitos de contraseña en tiempo real
  useEffect(() => {
    if (password) {
      const validacion = validarContraseña(password)
      setPasswordRequirements({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password),
      })
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Validar formulario
    const validacion = validarRegistro({ nombre: name, email, password })
    if (!validacion.valido) {
      setFieldErrors(validacion.errores)
      setError("Por favor completa correctamente todos los campos")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error en registro")

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token)
        // Marcar que la sesión se inició en esta pestaña / sesión
        sessionStorage.setItem("auth_active", "1")
      }

      // Redirigir al destino original si existe `next`
      const next = searchParams?.get("next")
      if (next) {
        try {
          const decoded = decodeURIComponent(next)
          router.push(decoded)
          return
        } catch (e) {}
      }

      router.push("/perfil")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const allPasswordRequirementsMet = Object.values(passwordRequirements).every((v) => v)

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Lado Izquierdo: Branding y Mensaje (Basado en la imagen) */}
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        {/* Elemento decorativo de fondo (opcional) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            {/* Simulación del Logo */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn's</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Tu Belleza, <br />
            <span className="text-pink-200">Nuestra Pasión</span>
          </h1>
          
          <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
            Academia Brenn’s tiene como objetivo principal educar con excelencia a las Manicuristas y Pedicuristas. Únete hoy a nuestra comunidad.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Crear cuenta</h2>
          <p className="text-gray-500 text-center mb-8">Regístrate para comenzar tu aprendizaje</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Pérez"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  fieldErrors.nombre
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                }`}
              />
              {fieldErrors.nombre && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
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
              {password && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-bold text-gray-700">Requisitos:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.length ? "text-green-600" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.length ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.uppercase ? "text-green-600" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.uppercase ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <span>Una mayúscula</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.lowercase ? "text-green-600" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.lowercase ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <span>Una minúscula</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.number ? "text-green-600" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.number ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <span>Un número</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.symbol ? "text-green-600" : "text-gray-500"}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.symbol ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <span>Un símbolo (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !allPasswordRequirementsMet}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrarme Ahora"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-pink-600 font-bold hover:text-pink-800 hover:underline transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}