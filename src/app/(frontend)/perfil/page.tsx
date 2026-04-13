// src/app/(frontend)/perfil/page.tsx
"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  Calendar, Mail, Phone, Edit2, Heart,
  Clock, CreditCard, Loader2
} from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import EditarPerfilModal from "@/components/ui/EditarPerfilModal"
import { useFavoritos } from "@/hooks/useFavoritos"
import Image from "next/image"
import Toast from "@/components/ui/Toast"

interface CustomUser {
  id?: number | string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  telefono?: string | null
}

type PedidoDetalle = { nombre_producto: string; cantidad: number }
type Pedido = {
  id: number
  fecha_pedido: string
  estado: string
  total: number
  detalles: PedidoDetalle[]
}
type Cita = {
  fecha: string
  hora: string
  estado: string
  servicio: { nombre: string; precio: number }
}

const ESTADO_PEDIDO: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PAGADO: "bg-blue-100 text-blue-800",
  ENVIADO: "bg-violet-100 text-violet-900",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
}

const ESTADO_CITA: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
  COMPLETADA: "bg-blue-100 text-blue-800",
}

function fotoKey(userId?: number | string) {
  return `brenns_foto_perfil_${userId ?? "anon"}`
}

export default function PerfilPage() {
  const { data: session, status, update } = useSession()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [datosLocales, setDatosLocales] = useState<Partial<CustomUser>>({})
  const [totalPedidos, setTotalPedidos] = useState<number | null>(null)
  const [totalCitas, setTotalCitas] = useState<number | null>(null)
  const { favoritos } = useFavoritos()
  const [fotoSubiendo, setFotoSubiendo] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null)

  const user = session?.user as CustomUser | undefined

  useEffect(() => {
    if (!user?.id) return
    const cached = localStorage.getItem(fotoKey(user.id))
    if (cached && !user.image) {
      setDatosLocales(prev => ({ ...prev, image: cached }))
    }
  }, [user?.id, user?.image])

  useEffect(() => {
    if (user?.image) {
      setDatosLocales(prev => ({ ...prev, image: user.image ?? undefined }))
    }
  }, [user?.image])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/pedidos").then(r => r.json())
      .then(d => setTotalPedidos(Array.isArray(d) ? d.length : 0))
      .catch(() => setTotalPedidos(0))

    fetch("/api/citas").then(r => r.json())
      .then(d => setTotalCitas(Array.isArray(d.citas) ? d.citas.length : 0))
      .catch(() => setTotalCitas(0))
  }, [status])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#fff8fa] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      </div>
    )
  }

  if (!session?.user) return null

  const nombre = datosLocales.name ?? user?.name ?? "Usuario"
  const correo = datosLocales.email ?? user?.email ?? ""
  const telefono = datosLocales.telefono ?? user?.telefono ?? null
  const fotoPerfil = datosLocales.image ?? user?.image ?? null
  const primerLetra = nombre.charAt(0).toUpperCase()
  const fechaReg = new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })

  const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoSubiendo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const resUpload = await fetch("/api/usuario/upload-foto", { method: "POST", body: formData })
      const uploadData = await resUpload.json()
      if (!resUpload.ok) throw new Error(uploadData.error || "Error")

      await fetch("/api/usuario/foto", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadData.url }),
      })

      if (user?.id) localStorage.setItem(fotoKey(user.id), uploadData.url)
      setDatosLocales(prev => ({ ...prev, image: uploadData.url }))
      await update({ image: uploadData.url })
      setToast({ message: "✅ Foto actualizada", type: "success" })
    } catch {
      setToast({ message: "Error al subir foto", type: "error" })
    } finally {
      setFotoSubiendo(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8fa] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Mi Perfil", href: "#", active: true }]} />

        {/* ── Header / Hero ── */}
        <div className="bg-white border border-[#ffd6e3] rounded-[2rem] p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-rose-100 bg-rose-50">
                {fotoPerfil ? (
                  <Image src={fotoPerfil} alt="Perfil" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-500 text-4xl font-bold">{primerLetra}</div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-rose-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition">
                <Edit2 className="w-3.5 h-3.5 text-rose-500" />
                <input type="file" className="hidden" onChange={handleSubirFoto} disabled={fotoSubiendo} />
              </label>
              {fotoSubiendo && <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-rose-500" /></div>}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-[#3d0020]">{nombre}</h1>
              <p className="text-rose-500 text-xs font-black uppercase tracking-[0.2em] mt-1">
                {user?.role === "ADMIN" ? "ADMINISTRADOR" : user?.role === "DOCENTE" ? "DOCENTE" : "MIEMBRO"}
              </p>
              <p className="text-gray-400 text-sm mt-1">Miembro desde {fechaReg}</p>
            </div>
          </div>
          <button onClick={() => setModalAbierto(true)} className="bg-[#0f172a] hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-200">
            <Edit2 className="w-4 h-4" /> Editar perfil
          </button>
        </div>

        {/* ── Grid Principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda (Info y Favoritos) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-rose-500 mb-6">Información Personal</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Correo</p>
                    <p className="text-sm font-bold text-[#3d0020] truncate">{correo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Teléfono</p>
                    <p className={`text-sm font-bold ${telefono ? "text-[#3d0020]" : "text-gray-300 italic"}`}>
                      {telefono ?? "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/favoritos" className="block bg-[#fff0f5] border border-[#ffd0e0] rounded-[1.5rem] p-8 text-center group hover:scale-[1.02] transition-transform">
              <Heart className="w-8 h-8 text-rose-500 mx-auto mb-3 fill-rose-500" />
              <p className="text-5xl font-black text-rose-600 leading-none">{favoritos.length}</p>
              <p className="text-xs font-black uppercase tracking-widest text-rose-400 mt-2">Favoritos</p>
            </Link>
          </div>

          {/* Columna Derecha (Stats y Actividad) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 text-center shadow-sm">
                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-3xl font-black text-[#3d0020]">0</p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Cursos</p>
              </div>
              <Link href="/mis-citas" className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 text-center shadow-sm hover:bg-rose-50 transition group">
                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition">
                  <Clock className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-3xl font-black text-[#3d0020]">{totalCitas ?? "0"}</p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Mis Citas</p>
              </Link>
              <Link href="/mis-pedidos" className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 text-center shadow-sm hover:bg-rose-50 transition group">
                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition">
                  <CreditCard className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-3xl font-black text-[#3d0020]">{totalPedidos ?? "0"}</p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Compras</p>
              </Link>
            </div>

            <UltimaCompraSection />
            <UltimaCitaSection />
          </div>
        </div>
      </div>

      {modalAbierto && <EditarPerfilModal onClose={() => setModalAbierto(false)} onActualizado={setDatosLocales} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  )
}

function UltimaCompraSection() {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pedidos").then(r => r.json()).then(d => {
      setPedido(Array.isArray(d) && d.length > 0 ? d[0] : null)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#3d0020]">Mi Última Compra</h3>
        <Link href="/mis-pedidos" className="text-xs font-bold text-rose-500 hover:underline">Ver todas →</Link>
      </div>
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-rose-200 mx-auto py-4" />
      ) : pedido ? (
        <div className="bg-[#fff8fa] border border-[#ffe4ef] rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-black text-[#3d0020]">Pedido #{String(pedido.id).padStart(6, "0")}</p>
            <p className="text-xs text-[#b06080] mt-1">{pedido.detalles?.map(d => `${d.nombre_producto} ×${d.cantidad}`).join(" · ")}</p>
            <p className="text-[10px] text-gray-400 mt-1">{new Date(pedido.fecha_pedido).toLocaleDateString("es-MX")}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[9px] font-black px-3 py-1 rounded-full ${ESTADO_PEDIDO[pedido.estado]}`}>{pedido.estado}</span>
            <p className="text-lg font-black text-[#3d0020] mt-1">${pedido.total.toLocaleString("es-MX")} MXN</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400 italic">No hay compras recientes.</p>
      )}
    </div>
  )
}

function UltimaCitaSection() {
  const [cita, setCita] = useState<Cita | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/citas").then(r => r.json()).then(d => {
      setCita(Array.isArray(d.citas) && d.citas.length > 0 ? d.citas[0] : null)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-white border border-[#ffd6e3] rounded-[1.5rem] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#3d0020]">Mi Última Cita</h3>
        <Link href="/mis-citas" className="text-xs font-bold text-rose-500 hover:underline">Ver todas →</Link>
      </div>
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-rose-200 mx-auto py-4" />
      ) : cita ? (
        <div className="bg-[#fff8fa] border border-[#ffe4ef] rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-black text-[#3d0020]">{cita.servicio.nombre}</p>
            <p className="text-xs text-[#b06080] mt-1">{new Date(cita.fecha).toLocaleDateString("es-MX")} · {cita.hora}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[9px] font-black px-3 py-1 rounded-full ${ESTADO_CITA[cita.estado]}`}>{cita.estado}</span>
            <p className="text-lg font-black text-[#3d0020] mt-1">${cita.servicio.precio.toLocaleString("es-MX")} MXN</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400 italic">No tienes citas agendadas.</p>
      )}
    </div>
  )
}