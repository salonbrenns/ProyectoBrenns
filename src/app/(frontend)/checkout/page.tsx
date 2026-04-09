"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import AuthGuard from "@/components/ui/AuthGuard"
import Breadcrumb from "@/components/Breadcrumb"
import { CreditCard, Lock, CheckCircle, Package, ShieldAlert } from "lucide-react"
import { validarInscripcion } from "@/lib/validation"

type CartItem = {
  id: number
  nombre: string
  categoria: string
  precio: number
  cantidad: number
  img: string
}

const COSTO_ENVIO = 10000
const ENVIO_GRATIS_DESDE = 150000

export default function CheckoutPage() {
  const { data: session } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  
  // Se eliminaron correo y telefono de aquí
  const [formData, setFormData] = useState({
    nombre: "", 
    apellido: "",
    nombreTarjeta: "", 
    numeroTarjeta: "", 
    expiracion: "", 
    cvv: ""
  })
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [errorRasp, setErrorRasp] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("nail_store_cart")
    if (stored) setItems(JSON.parse(stored))

    if (session?.user) {
      const nombreCompleto = session.user.name || ""
      const partes = nombreCompleto.split(" ")
      setFormData(prev => ({
        ...prev,
        nombre: partes[0] || "",
        apellido: partes.slice(1).join(" ") || "",
        // Se eliminó la carga de correo y telefono
      }))
    }
  }, [session])

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  const total = subtotal + envio
  const totalArticulos = items.reduce((acc, item) => acc + item.cantidad, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrorRasp(null)
  }

  const handlePago = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError(null)
    setErrorRasp(null)

    const validacion = validarInscripcion(formData)
    if (!validacion.valido) {
      setFieldErrors(validacion.errores)
      setGeneralError("Por favor completa correctamente todos los campos")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal: subtotal / 100,
          costo_envio: envio / 100,
          total: total / 100,
          nombre_cliente: `${formData.nombre} ${formData.apellido}`.trim(),
        }),
      })

      const data = await res.json()

      if (res.status === 403) {
        setErrorRasp(data.error ?? "Tu solicitud fue bloqueada por seguridad.")
        return
      }

      if (!res.ok) throw new Error(data.error || "Error al procesar el pedido")

      localStorage.removeItem("nail_store_cart")
      window.dispatchEvent(new Event("carrito-actualizado"))
      setExito(true)

    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : "Error al procesar el pedido")
    } finally {
      setLoading(false)
    }
  }

  // --- RENDERIZADO (Se mantiene igual, ya no contiene inputs de correo/tel) ---
  if (exito) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Pedido realizado!</h2>
            <p className="text-gray-600 mb-2">Gracias por tu compra en <span className="text-pink-600 font-bold">Brenn&apos;s</span></p>
            <p className="text-gray-500 text-sm mb-8">Recibirás un correo con los detalles de tu pedido.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/mis-cursos" className="bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition">
                Ver mi historial
              </Link>
              <Link href="/catalogo" className="border-2 border-pink-200 text-pink-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (items.length === 0) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-20">
          <div className="text-center">
            <Package className="w-24 h-24 mx-auto text-pink-200 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h2>
            <Link href="/catalogo" className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-10 py-4 rounded-full text-xl">
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[
            { label: "Carrito", href: "/carrito" },
            { label: "Checkout", href: "#", active: true }
          ]} />

          <h1 className="text-5xl font-bold text-center text-pink-600 mb-12">Finalizar Compra</h1>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <CreditCard className="w-10 h-10 text-pink-600" />
                  Datos de pago
                </h2>

                <form className="space-y-8" onSubmit={handlePago}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold mb-2">Nombre</label>
                      <input name="nombre" value={formData.nombre} onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${fieldErrors.nombre ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                        placeholder="Ana Karen" />
                      {fieldErrors.nombre && <p className="text-red-600 text-xs mt-1">{fieldErrors.nombre}</p>}
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2">Apellido</label>
                      <input name="apellido" value={formData.apellido} onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${fieldErrors.apellido ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                        placeholder="Gómez López" />
                      {fieldErrors.apellido && <p className="text-red-600 text-xs mt-1">{fieldErrors.apellido}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-bold mb-2">Nombre en la tarjeta</label>
                    <input name="nombreTarjeta" value={formData.nombreTarjeta} onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${fieldErrors.nombreTarjeta ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                      placeholder="Ana Karen Gómez López" />
                    {fieldErrors.nombreTarjeta && <p className="text-red-600 text-xs mt-1">{fieldErrors.nombreTarjeta}</p>}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative">
                      <label className="block text-lg font-bold mb-2">Número de tarjeta</label>
                      <input name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleChange} maxLength={19}
                        className={`w-full px-6 py-4 pl-16 rounded-full border-2 outline-none transition-all ${fieldErrors.numeroTarjeta ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                        placeholder="1234 5678 9012 3456" />
                      <CreditCard className="absolute left-5 top-12 w-8 h-8 text-pink-600" />
                      {fieldErrors.numeroTarjeta && <p className="text-red-600 text-xs mt-1">{fieldErrors.numeroTarjeta}</p>}
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2">MM / AA</label>
                      <input name="expiracion" value={formData.expiracion} onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${fieldErrors.expiracion ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                        placeholder="12 / 28" />
                      {fieldErrors.expiracion && <p className="text-red-600 text-xs mt-1">{fieldErrors.expiracion}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-bold mb-2">CVV</label>
                    <input name="cvv" value={formData.cvv} onChange={handleChange} maxLength={4}
                      className={`w-48 px-6 py-4 rounded-full border-2 outline-none transition-all ${fieldErrors.cvv ? "border-red-500" : "border-pink-200 focus:border-pink-500"}`}
                      placeholder="123" />
                    {fieldErrors.cvv && <p className="text-red-600 text-xs mt-1">{fieldErrors.cvv}</p>}
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Tus datos están protegidos con encriptación SSL</span>
                  </div>

                  {errorRasp && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 rounded-2xl px-4 py-3 text-sm">
                      <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Solicitud bloqueada por seguridad</p>
                        <p className="text-red-600 mt-0.5">{errorRasp}</p>
                      </div>
                    </div>
                  )}

                  {generalError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                      {generalError}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-2xl py-6 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    <CheckCircle className="w-9 h-9" />
                    {loading ? "Procesando..." : `Pagar $${(total / 100).toFixed(2)} MXN`}
                  </button>
                </form>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl shadow-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-3">
                  <Package className="w-8 h-8" />
                  Resumen
                </h2>
                <div className="bg-white/90 rounded-2xl p-6 space-y-4 max-h-96 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-pink-100 last:border-0">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        <Image src={item.img} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">{item.nombre}</h4>
                        <p className="text-sm text-pink-600">{item.categoria}</p>
                        <p className="font-bold text-pink-600">
                          ${((item.precio * item.cantidad) / 100).toFixed(2)}
                          <span className="text-gray-500 font-normal text-xs"> × {item.cantidad}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({totalArticulos} art.)</span>
                      <span className="font-bold">${(subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Envío</span>
                      {envio === 0
                        ? <span className="text-green-600 font-bold">GRATIS</span>
                        : <span className="font-bold">${(envio / 100).toFixed(2)}</span>
                      }
                    </div>
                    <div className="border-t-2 border-pink-300 pt-3 flex justify-between text-2xl font-black text-pink-600">
                      <span>Total</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
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