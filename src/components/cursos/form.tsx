'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Info } from 'lucide-react'
import UploadCursoImages from './UploadCursoImages'
import Link from 'next/link'

interface Curso {
  id?: number
  codigo: string
  titulo: string
  descripcion?: string
  precio_total: number
  cupo_maximo: number
  duracion_horas?: number
  nivel?: string
  fecha_inicio?: string
  fecha_fin?: string
  activo: boolean
  imagenes: string[]
}

const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wider'

export default function CursoForm({ curso }: { curso?: Curso }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState<Curso>(
    curso || {
      codigo: '', titulo: '', descripcion: '', precio_total: 0, cupo_maximo: 0,
      duracion_horas: 0, nivel: '', fecha_inicio: '', fecha_fin: '', activo: true, imagenes: []
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const method = curso ? 'PUT' : 'POST'
      const url = curso ? `/api/admin/cursos/${curso.id}` : '/api/admin/cursos'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      router.push('/admin/cursos')
      router.refresh()
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white shadow-2xl border border-pink-100 overflow-hidden">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-600 px-10 py-6">
        <h2 className="text-2xl font-semibold text-white tracking-wide">
          {curso ? 'Editar Curso' : 'Nuevo Curso'}
        </h2>
        <p className="text-pink-100 text-sm mt-1">Completa la información del curso</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-0">

          {/* COLUMNA IZQUIERDA */}
          <div className="flex-1 p-10 space-y-8">

            <section className="space-y-6">
              <h3 className={labelClass}>Información General</h3>

              <div className="space-y-1">
                <label className={labelClass}>Código *</label>
                <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ej. CURSO-001" required className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Título del curso *</label>
                <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Nombre del curso" required className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} placeholder="Describe el contenido y objetivo del curso..." className={`${inputClass} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Precio (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" name="precio_total" value={form.precio_total} onChange={handleChange} required className={`${inputClass} pl-8`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Cupo máximo *</label>
                  <input type="number" name="cupo_maximo" value={form.cupo_maximo} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className={labelClass}>Detalles del Curso</h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Duración (horas)</label>
                  <input type="number" name="duracion_horas" value={form.duracion_horas} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Nivel</label>
                  <select name="nivel" value={form.nivel} onChange={handleChange} className={inputClass}>
                    <option value="">Seleccionar nivel</option>
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Fecha Inicio</label>
                  <input type="date" name="fecha_inicio" value={form.fecha_inicio || ''} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Fecha Fin</label>
                  <input type="date" name="fecha_fin" value={form.fecha_fin || ''} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </section>

            {/* Activo */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={form.activo}
                  onChange={() => setForm(prev => ({ ...prev, activo: !prev.activo }))}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-pink-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">Curso activo</span>
            </label>
          </div>

          {/* DIVISOR */}
          <div className="w-px bg-pink-100 my-10" />

          {/* COLUMNA DERECHA - IMÁGENES */}
          <div className="w-96 flex-shrink-0 p-10">
            
            
            <UploadCursoImages
              value={form.imagenes}
              onChange={(imgs) => setForm(prev => ({ ...prev, imagenes: imgs }))}
            />

            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-xs text-amber-700 flex gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                Puedes subir hasta <strong>4 imágenes</strong> para el curso.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 px-10 py-6 bg-gray-50 border-t">
          <Link
            href="/admin/cursos"
            className="px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 rounded-xl bg-pink-700 text-white font-semibold hover:bg-pink-800 disabled:opacity-60 transition flex items-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="animate-spin w-4 h-4" /> Guardando...</>
            ) : curso ? 'Actualizar Curso' : 'Crear Curso'}
          </button>
        </div>
      </form>
    </div>
  )
}