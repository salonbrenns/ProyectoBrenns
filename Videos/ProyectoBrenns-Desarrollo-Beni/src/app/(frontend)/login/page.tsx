"use client"
import React, { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

function LoginContenido() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) { setError("Por favor completa todos los campos"); return }
    setLoading(true)
    try {
      const result = await signIn("credentials", { correo: email, password, redirect: false })
      if (result?.error) { setError(result.error); return }
      const next = searchParams?.get("next")
      router.push(next ? decodeURIComponent(next) : "/perfil")
      router.refresh()
    } catch {
      setError("Error inesperado. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn&apos;s</span>
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

      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 text-center mb-8">Ingresa tus credenciales para entrar</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                <Link href="/recuperar-contrasena" className="text-xs text-pink-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors focus:outline-none">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
      </div>
    }>
      <LoginContenido />
    </Suspense>
  )
}