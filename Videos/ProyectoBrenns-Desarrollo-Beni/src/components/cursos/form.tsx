'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function CursoForm({ curso }: { curso?: Curso }) {
  const router = useRouter()

  const [form, setForm] = useState<Curso>(
    curso || {
      codigo: '',
      titulo: '',
      descripcion: '',
      precio_total: 0,
      cupo_maximo: 0,
      duracion_horas: 0,
      nivel: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: true,
      imagenes: [],
    }
  )

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const method = curso ? 'PUT' : 'POST'
    const url = curso
      ? `/api/admin/cursos/${curso.id}`
      : `/api/admin/cursos`

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    router.push('/admin/cursos')
    router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">

      {/* MIGAS */}
      <Link href="/admin/cursos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-pink-700 transition-colors">
        ← Volver a cursos
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >

        {/* HEADER */}
        <div className="px-8 py-5 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-pink-900">
            {curso ? 'Editar Curso' : 'Nuevo Curso'}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {curso ? 'Modifica los datos del curso existente' : 'Completa la información para crear un nuevo curso'}
          </p>
        </div>

        <div className="p-8 space-y-10">

          {/* IMÁGENES */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Imágenes del curso</h3>
              <p className="text-xs text-gray-400 mt-1">Sube hasta 4 imágenes representativas del curso</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors bg-gray-50/50">
              <UploadCursoImages
                value={form.imagenes}
                onChange={(imgs) => setForm({ ...form, imagenes: imgs })}
              />
              <p className="text-xs text-gray-400 mt-3">Máximo 4 imágenes</p>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* COLUMNA IZQUIERDA */}
            <section className="space-y-6">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Información general</h3>
              </div>

              {/* Código */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Código</label>
                <input
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  placeholder="Ej. CURSO-001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition placeholder-gray-300"
                />
              </div>

              {/* Título */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Nombre del curso"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition placeholder-gray-300"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe el contenido y objetivo del curso..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none placeholder-gray-300"
                />
              </div>

              {/* Precio + Cupo */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Precio (MXN)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      name="precio_total"
                      value={form.precio_total}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Cupo máximo</label>
                  <input
                    type="number"
                    name="cupo_maximo"
                    value={form.cupo_maximo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </section>

            {/* COLUMNA DERECHA */}
            <section className="space-y-6">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Detalles del curso</h3>
              </div>

              {/* Duración */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Duración (horas)</label>
                <input
                  type="number"
                  name="duracion_horas"
                  value={form.duracion_horas}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                />
              </div>

              {/* Nivel */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Nivel</label>
                <select
                  name="nivel"
                  value={form.nivel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-white"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="BASICO">Básico</option>
                  <option value="INTERMEDIO">Intermedio</option>
                  <option value="AVANZADO">Avanzado</option>
                </select>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={form.fecha_inicio || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Fecha fin</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={form.fecha_fin || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* SWITCH */}
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Curso activo</p>
                  <p className="text-xs text-gray-400 mt-0.5">Visible para clientes en el sitio</p>
                </div>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, activo: !form.activo })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    form.activo ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                      form.activo ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </section>

          </div>

        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t flex justify-end gap-3 bg-gray-50">
          <Link
            href="/admin/cursos"
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-pink-700 text-white text-sm font-medium rounded-lg hover:bg-pink-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : curso ? 'Actualizar curso' : 'Crear curso'}
          </button>
        </div>

      </form>
    </div>
  )
}