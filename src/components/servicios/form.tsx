'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const CATEGORIAS = ['Manicura', 'Pedicura', 'Uñas', 'Tratamiento', 'Otro']

interface ServicioData {
  id: number
  nombre: string
  descripcion: string
  precio: number
  duracion: string
  categoria: string
  imagen: string
  activo: boolean
}

interface Props {
  servicio?: ServicioData
}

export default function ServicioForm({ servicio }: Props) {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const esEditar = !!servicio

  const [form, setForm] = useState({
    nombre:      servicio?.nombre      || '',
    descripcion: servicio?.descripcion || '',
    precio:      servicio?.precio?.toString() || '',
    duracion:    servicio?.duracion    || '',
    categoria:   servicio?.categoria   || 'Manicura',
    activo:      servicio?.activo      ?? true,
  })
  const [imagenPreview, setImagenPreview] = useState<string>(servicio?.imagen || '')
  const [imagenFile,    setImagenFile]    = useState<File | null>(null)
  const [guardando,     setGuardando]     = useState(false)
  const [errores,       setErrores]       = useState<Record<string, string>>({})
  const [errorGeneral,  setErrorGeneral]  = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagenFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  const validar = () => {
    const errs: Record<string, string> = {}
    if (!form.nombre.trim())   errs.nombre  = 'El nombre es obligatorio'
    if (!form.precio)          errs.precio  = 'El precio es obligatorio'
    if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) errs.precio = 'Precio inválido'
    if (!form.duracion.trim()) errs.duracion = 'La duración es obligatoria'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrores({})
    setErrorGeneral('')

    const errs = validar()
    if (Object.keys(errs).length > 0) { setErrores(errs); return }

    setGuardando(true)
    try {
      let imagenUrl = servicio?.imagen || null

      // Subir imagen si hay nueva
      if (imagenFile) {
        const fd = new FormData()
        fd.append('file', imagenFile)
        const upRes  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const upData = await upRes.json()
        if (!upRes.ok) throw new Error('Error al subir la imagen')
        imagenUrl = upData.url
      }

      const body = {
        nombre:      form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio:      Number(form.precio),
        duracion:    form.duracion.trim(),
        categoria:   form.categoria,
        imagen:      imagenUrl,
        activo:      form.activo,
      }

      const url    = esEditar ? `/api/admin/servicios/${servicio!.id}` : '/api/admin/servicios'
      const method = esEditar ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }

      router.push('/admin/servicios')
      router.refresh()
   } catch (err) {
      // Verificamos si es un objeto de error estándar
      const mensaje = err instanceof Error ? err.message : 'Error inesperado'
      setErrorGeneral(mensaje)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Volver */}
      <Link
        href="/admin/servicios"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-700 transition"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver a servicios
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-200">

        {/* Imagen */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Imagen del servicio</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative cursor-pointer group w-full h-52 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-400 bg-gray-50 flex items-center justify-center overflow-hidden transition"
          >
            {imagenPreview ? (
              <Image
                src={imagenPreview}
                alt="preview"
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <PhotoIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Haz clic para subir una imagen</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Nombre */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            placeholder="Manicure Clásica Semipermanente"
            className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
              errores.nombre ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
        </div>

        {/* Descripción */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
            rows={3}
            placeholder="Describe el servicio..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none"
          />
        </div>

        {/* Precio + Duración */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio (MXN) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              placeholder="380"
              className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                errores.precio ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errores.precio && <p className="mt-1 text-xs text-red-600">{errores.precio}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duración <span className="text-red-500">*</span>
            </label>
            <input
              value={form.duracion}
              onChange={e => setForm({ ...form, duracion: e.target.value })}
              placeholder="60 min"
              className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${
                errores.duracion ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errores.duracion && <p className="mt-1 text-xs text-red-600">{errores.duracion}</p>}
          </div>
        </div>

        {/* Categoría */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <select
            value={form.categoria}
            onChange={e => setForm({ ...form, categoria: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition bg-white"
          >
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Activo */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Servicio activo</p>
            <p className="text-xs text-gray-500 mt-0.5">Visible para los clientes en el catálogo</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, activo: !form.activo })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.activo ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              form.activo ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Error general */}
      {errorGeneral && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorGeneral}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-4">
        <Link
          href="/admin/servicios"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition text-center"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 rounded-lg bg-pink-700 px-4 py-2 text-sm font-medium text-white hover:bg-pink-800 transition disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : esEditar ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </div>
    </form>
  )
}