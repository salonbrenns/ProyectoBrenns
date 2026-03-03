// src/app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AuthGuard from "@/components/ui/AuthGuard"
import Breadcrumb from "@/components/Breadcrumb"
import { CreditCard, Lock, CheckCircle, Package, Truck } from "lucide-react"
import { validarInscripcion } from "@/lib/validation"

type CartItem = {
  id: number
 nombre: string
 categoria: string
 precio: number
 cantidad: number
 img: string
}

const COSTO_ENVIO = 10000 // $100 MXN (en centavos)
const ENVIO_GRATIS_DESDE = 150000 // $1,500 MXN

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    nombre: "", apellido: "", correo: "", telefono: "",
    nombreTarjeta: "", numeroTarjeta: "", expiracion: "", cvv: ""
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar carrito
    const stored = localStorage.getItem("nail_store_cart")
    if (stored) {
      setItems(JSON.parse(stored))
    }

    // Pre-llenar datos del usuario autenticado
    const userEmail = localStorage.getItem("user_email") || ""
    const userName = localStorage.getItem("user_nombre") || ""
    
    if (userEmail || userName) {
      setFormData(prev => ({
        ...prev,
        nombre: userName,
        correo: userEmail
      }))
    }
  }, [])

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  const total = subtotal + envio
  const totalArticulos = items.reduce((acc, item) => acc + item.cantidad, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Formatear número de tarjeta con espacios
    if (e.target.name === "numeroTarjeta") {
      value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1").trim()
    }

    setFormData({ ...formData, [e.target.name]: value })
  }

  const handlePago = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError(null)

    // Validar formulario
    const validacion = validarInscripcion(formData)
    if (!validacion.valido) {
      setFieldErrors(validacion.errores)
      setGeneralError("Por favor completa correctamente todos los campos")
      return
    }

    // Simulación de pago exitoso
    alert("¡Pago realizado con éxito! Gracias por tu compra en Brenn's")
    
    // Limpiar carrito
    localStorage.removeItem("nail_store_cart")
    window.dispatchEvent(new Event("carrito-actualizado"))

    // Redirigir al inicio o a una página de éxito
    setTimeout(() => {
      window.location.href = "/catalogo"
    }, 1500)
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

        <h1 className="text-5xl font-bold text-center text-pink-600 mb-12">
          Finalizar Compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <CreditCard className="w-10 h-10 text-pink-600" />
                Pago con Tarjeta
              </h2>

              <form className="space-y-8" onSubmit={handlePago}>

                {/* Datos personales */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold mb-2">Nombre</label>
                    <input
                      name="nombre"
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                        fieldErrors.nombre ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                      }`}
                      placeholder="Ana Karen"
                    />
                    {fieldErrors.nombre && <p className="text-red-600 text-xs mt-1">{fieldErrors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2">Apellido</label>
                    <input
                      name="apellido"
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                        fieldErrors.apellido ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                      }`}
                      placeholder="Gómez López"
                    />
                    {fieldErrors.apellido && <p className="text-red-600 text-xs mt-1">{fieldErrors.apellido}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    onChange={handleChange}
                    className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                      fieldErrors.correo ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                    }`}
                    placeholder="ana@ejemplo.com"
                  />
                  {fieldErrors.correo && <p className="text-red-600 text-xs mt-1">{fieldErrors.correo}</p>}
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">Teléfono</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-5 rounded-l-full bg-gray-100 border-2 border-r-0 border-pink-200 text-gray-600">MX +52</span>
                    <input
                      name="telefono"
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-r-full border-2 outline-none transition-all ${
                        fieldErrors.telefono ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                      }`}
                      placeholder="961 123 4567"
                    />
                  </div>
                  {fieldErrors.telefono && <p className="text-red-600 text-xs mt-1">{fieldErrors.telefono}</p>}
                </div>

                {/* Datos de tarjeta */}
                <div>
                  <label className="block text-lg font-bold mb-2">Nombre en la tarjeta</label>
                  <input
                    name="nombreTarjeta"
                    onChange={handleChange}
                    className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                      fieldErrors.nombreTarjeta ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                    }`}
                    placeholder="Ana Karen Gómez López"
                  />
                  {fieldErrors.nombreTarjeta && <p className="text-red-600 text-xs mt-1">{fieldErrors.nombreTarjeta}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 relative">
                    <label className="block text-lg font-bold mb-2">Número de tarjeta</label>
                    <input
                      name="numeroTarjeta"
                      onChange={handleChange}
                      maxLength={19}
                      className={`w-full px-6 py-4 pl-16 rounded-full border-2 outline-none transition-all ${
                        fieldErrors.numeroTarjeta ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    <CreditCard className="absolute left-5 top-12 w-8 h-8 text-pink-600" />
                    {fieldErrors.numeroTarjeta && <p className="text-red-600 text-xs mt-1">{fieldErrors.numeroTarjeta}</p>}
                  </div>

                  <div>
                    <label className="block text-lg font-bold mb-2">MM / AA</label>
                    <input
                      name="expiracion"
                      onChange={handleChange}
                      placeholder="12 / 28"
                      className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                        fieldErrors.expiracion ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                      }`}
                    />
                    {fieldErrors.expiracion && <p className="text-red-600 text-xs mt-1">{fieldErrors.expiracion}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">CVV</label>
                  <input
                    name="cvv"
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="123"
                    className={`w-full px-6 py-4 rounded-full border-2 outline-none transition-all ${
                      fieldErrors.cvv ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-pink-200 focus:border-pink-500"
                    }`}
                  />
                  {fieldErrors.cvv && <p className="text-red-600 text-xs mt-1">{fieldErrors.cvv}</p>}
                </div>

                

                {generalError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                    {generalError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-2xl py-6 rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
                >
                  <CheckCircle className="w-9 h-9" />
                  Pagar ${(total / 100).toFixed(2)} MXN
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl shadow-2xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Resumen de tu compra
              </h2>

              <div className="bg-white/90 rounded-2xl p-6 space-y-5 max-h-96 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-pink-100 last:border-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                      <Image src={item.img} alt={item.nombre} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.nombre}</h4>
                      <p className="text-sm text-pink-600">{item.categoria}</p>
                      <p className="text-lg font-bold text-pink-600">
                        ${((item.precio * item.cantidad) / 100).toFixed(2)}
                        <span className="text-sm text-gray-600 font-normal"> × {item.cantidad}</span>
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-6 space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalArticulos} artículo{totalArticulos !== 1 && "s"})</span>
                    <span className="font-bold">${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    {envio === 0 ? (
                      <span className="text-green-600 font-bold">GRATIS</span>
                    ) : (
                      <span>${(envio / 100).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="border-t-2 border-pink-300 pt-4">
                    <div className="flex justify-between text-2xl font-black text-pink-600">
                      <span>Total</span>
                      <span>${(total / 100).toFixed(2)} MXN</span>
                    </div>
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