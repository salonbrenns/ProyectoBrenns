"use client"
import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { validarRegistro } from "@/lib/validation"
import { Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react"

function RegisterContenido() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [telefono, setTelefono] = useState("")
  const [countryCode, setCountryCode] = useState("+52")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false, uppercase: false, lowercase: false, number: false, symbol: false,
  })

  useEffect(() => {
    if (password) {
      setPasswordRequirements({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password),
      })
    }
  }, [password])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 10) setTelefono(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (telefono.length > 0 && telefono.length !== 10) { setError("El teléfono debe tener exactamente 10 dígitos"); return }
    const validacion = validarRegistro({ nombre: name, email, password })
    if (!validacion.valido) { setError("Por favor completa correctamente todos los campos"); return }
    setLoading(true)
    try {
      const fullPhone = `${countryCode}${telefono}`
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, telefono: fullPhone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error en registro")
      const { signIn } = await import("next-auth/react")
      const result = await signIn("credentials", { correo: email, password, redirect: false })
      if (result?.error) throw new Error(result.error)
      const next = searchParams?.get("next")
      router.push(next ? decodeURIComponent(next) : "/perfil")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const allPasswordRequirementsMet = Object.values(passwordRequirements).every((v) => v)

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 flex flex-col justify-center items-start text-white relative overflow-hidden">
        <div className="z-10 relative">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold">B</div>
            <span className="text-xl font-bold tracking-wide">Brenn&apos;s</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Tu Belleza, <br /><span className="text-pink-200">Nuestra Pasión</span></h1>
          <p className="text-lg md:text-xl text-pink-50 max-w-lg leading-relaxed">Academia Brenn&apos;s tiene como objetivo principal educar con excelencia.</p>
        </div>
      </div>

      <div className="flex-1 bg-pink-50 p-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Crear cuenta</h2>
          <p className="text-gray-500 text-center mb-8">Regístrate para comenzar tu aprendizaje</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. María Pérez"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Requisitos:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "length", label: "Mín. 8 caracteres" },
                      { key: "uppercase", label: "Una mayúscula" },
                      { key: "lowercase", label: "Una minúscula" },
                      { key: "number", label: "Un número" },
                    ].map(({ key, label }) => (
                      <div key={key} className={`flex items-center gap-1.5 text-[11px] ${passwordRequirements[key as keyof typeof passwordRequirements] ? "text-green-600" : "text-gray-400"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements[key as keyof typeof passwordRequirements] ? "bg-green-600" : "bg-gray-300"}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] ${passwordRequirements.symbol ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.symbol ? "bg-green-600" : "bg-gray-300"}`} />
                    Un símbolo (!@#$%^&*)
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
              <div className="flex gap-2">
                <div className="relative min-w-[100px]">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-pink-500 outline-none cursor-pointer">
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+34">🇪🇸 +34</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
                <input type="tel" value={telefono} onChange={handlePhoneChange} placeholder="10 dígitos"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Solo números, sin espacios.</p>
            </div>
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">{error}</div>}
            <button type="submit" disabled={loading || !allPasswordRequirementsMet || telefono.length !== 10}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Registrando..." : "Registrarme Ahora"}
            </button>
          </form>
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-pink-600 font-bold hover:underline">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-pink-400 animate-spin" /></div>}>
      <RegisterContenido />
    </Suspense>
  )
}