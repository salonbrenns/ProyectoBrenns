"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetContraseñaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  })

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const emailParam = searchParams.get("email")

    if (!tokenParam || !emailParam) {
      setError("Enlace de reset inválido o expirado")
      return
    }

    setToken(tokenParam)
    setEmail(emailParam)
  }, [searchParams])

  // Validar requisitos de contraseña
  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password),
    })
  }, [password])

  const allValidationsMet = Object.values(validations).every((v) => v)
  const passwordsMatch = password === confirmPassword && password !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!allValidationsMet) {
      setError("La contraseña no cumple con todos los requisitos")
      return
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!token || !email) {
      setError("Enlace inválido. Por favor solicita una nueva recuperación.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Error al actualizar tu contraseña")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enlace Inválido</h2>
          <p className="text-gray-600 mb-6">El enlace de reset ha expirado o es inválido.</p>
          <Link href="/recuperar-contraseña" className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-700 transition-all">
            Solicitar Nuevo Enlace
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="z-10 relative">
            <div className="mb-8 flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
              <span className="text-xl font-bold tracking-wide">Brenn's</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              ¡Contraseña <br />
              <span className="text-pink-200">Actualizada!</span>
            </h1>

            <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
              Tu contraseña ha sido reset exitosamente. Serás redirigido al login en unos momentos.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Listo!</h2>
              <p className="text-gray-600">Tu contraseña ha sido actualizada correctamente.</p>
            </div>

            <Link href="/login" className="w-full bg-pink-600 text-white py-3 rounded-full font-bold hover:bg-pink-700 transition-all">
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn's</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Crea una Nueva <br />
            <span className="text-pink-200">Contraseña</span>
          </h1>

          <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">
            Asegúrate de crear una contraseña fuerte que cumpla con todos los requisitos de seguridad.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Reset Contraseña</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">Ingresa tu correo: {email}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-5 h-5 text-pink-600 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Requisitos de Contraseña */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-xs font-bold text-gray-700 mb-3">Requisitos:</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 text-xs ${validations.length ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-3 h-3 rounded-full ${validations.length ? "bg-green-600" : "bg-gray-300"}`}></div>
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${validations.uppercase ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-3 h-3 rounded-full ${validations.uppercase ? "bg-green-600" : "bg-gray-300"}`}></div>
                  <span>Una mayúscula (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${validations.lowercase ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-3 h-3 rounded-full ${validations.lowercase ? "bg-green-600" : "bg-gray-300"}`}></div>
                  <span>Una minúscula (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${validations.number ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-3 h-3 rounded-full ${validations.number ? "bg-green-600" : "bg-gray-300"}`}></div>
                  <span>Un número (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${validations.symbol ? "text-green-600" : "text-gray-500"}`}>
                  <div className={`w-3 h-3 rounded-full ${validations.symbol ? "bg-green-600" : "bg-gray-300"}`}></div>
                  <span>Un símbolo (!@#$%^&*)</span>
                </div>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-5 h-5 text-pink-600 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 px-4 py-2 rounded-lg border outline-none transition-all ${
                    confirmPassword === ""
                      ? "border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                      : passwordsMatch
                      ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  }`}
                />
              </div>
              {confirmPassword !== "" && (
                <p className={`text-xs mt-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                  {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                </p>
              )}
            </div>

            {/* Mostrar/Ocultar Contraseña */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-pink-600 cursor-pointer"
              />
              <span>Mostrar contraseña</span>
            </label>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !allValidationsMet || !passwordsMatch}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-pink-600 font-bold hover:text-pink-700">
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
