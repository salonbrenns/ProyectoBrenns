// src/components/AddToCarButton.tsx
"use client"
import { ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

interface Producto {
  id: number
  nombre: string
  categoria: string
  precio: number
  img: string
}

// 1. Definimos el tipo para los objetos dentro del carrito
interface CartItem extends Producto {
  cantidad: number
}

export function AddToCarButton({ producto }: { producto: Producto }) {
  const router = useRouter()

  const agregarAlCarrito = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (!token) {
      router.push("/login")
      return
    }

    const stored = localStorage.getItem("nail_store_cart") || "[]"
    // 2. Le decimos a JSON.parse que el resultado es un array de CartItem
    const carrito: CartItem[] = JSON.parse(stored)

    // 3. Ahora 'item' hereda automáticamente el tipo CartItem
    const existe = carrito.find((item) => item.id === producto.id)
    const cantidad = 1

    let nuevoCarrito: CartItem[]
    if (existe) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      )
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad }]
    }

    localStorage.setItem("nail_store_cart", JSON.stringify(nuevoCarrito))

    // Lógica del toast
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