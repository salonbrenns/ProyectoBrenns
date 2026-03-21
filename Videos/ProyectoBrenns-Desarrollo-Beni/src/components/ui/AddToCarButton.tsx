// src/components/AddToCarButton.tsx
"use client"
import { ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

// Define la estructura del producto que necesita el botón
interface Producto {
  id: number
  nombre: string
  categoria: string
  precio: number
  img: string
}

export function AddToCarButton({ producto }: { producto: Producto }) {
  const router = useRouter()

  const agregarAlCarrito = () => {
    // Verificar si el usuario está autenticado
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (!token) {
      // Redirigir a login si no está autenticado
      router.push("/login")
      return
    }

    // Toda la lógica de cliente (localStorage, document) va aquí (solo se ejecuta si está autenticado)
    const stored = localStorage.getItem("nail_store_cart") || "[]"
    const carrito = JSON.parse(stored)

    const existe = carrito.find((item: any) => item.id === producto.id)
    const cantidad = 1

    let nuevoCarrito
    if (existe) {
      nuevoCarrito = carrito.map((item: any) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      )
    } else {
      nuevoCarrito = [...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        cantidad,
        img: producto.img,
      }]
    }

    localStorage.setItem("nail_store_cart", JSON.stringify(nuevoCarrito))

    // Lógica del toast (manipulación del DOM)
    const toast = document.createElement("div")
    toast.textContent = `¡${cantidad} ${producto.nombre} agregado al carrito!`
    toast.style.cssText = `
      position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
      background:#ec4899;color:white;padding:16px 40px;border-radius:50px;
      font-weight:bold;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,0.3);
      transition:opacity 0.4s;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.style.opacity = "0", 2200)
    setTimeout(() => toast.remove(), 2600)
  }

  return (
    <button
      onClick={agregarAlCarrito}
      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg py-4 rounded-full shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
    >
      <ShoppingBag className="w-5 h-5" />
      Agregar al Carrito
    </button>
  )
}