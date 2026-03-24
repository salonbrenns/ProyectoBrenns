'use client'

import { useState } from "react"

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function UploadCursoImages({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string[]>(value || [])
  const [loading, setLoading] = useState(false)

  // SUBIR IMÁGENES
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (preview.length + files.length > 4) {
      alert("Máximo 4 imágenes")
      return
    }

    setLoading(true)

    const formData = new FormData()
    files.forEach(file => formData.append("files", file))

    const res = await fetch("/api/admin/cursos/upload", {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    const nuevas = [...preview, ...data.urls]

    setPreview(nuevas)
    onChange(nuevas)
    setLoading(false)
  }

  // ELIMINAR IMAGEN
  const removeImage = (url: string) => {
    const nuevas = preview.filter(img => img !== url)
    setPreview(nuevas)
    onChange(nuevas)
  }

  // REORDENAR IMÁGENES
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= preview.length) return

    const updated = [...preview]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)

    setPreview(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">

      {/* INPUT */}
      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="block w-full text-sm"
      />

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Subiendo imágenes...</p>
      )}

      {/* PREVIEW */}
      <div className="flex gap-4 flex-wrap">
        {preview.map((img, index) => (
          <div
            key={img}
            className="relative flex flex-col items-center border rounded-lg p-2 bg-white shadow-sm"
          >

            {/* IMAGEN */}
            <img
              src={img}
              className="w-24 h-24 object-cover rounded"
            />

            {/* BOTONES ORDEN */}
            <div className="flex gap-1 mt-2">
              <button
                type="button"
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
                className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-30"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => moveImage(index, index + 1)}
                disabled={index === preview.length - 1}
                className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-30"
              >
                →
              </button>
            </div>

            {/* ELIMINAR */}
            <button
              type="button"
              onClick={() => removeImage(img)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
            >
              ✕
            </button>

          </div>
        ))}
      </div>

      {/* INFO */}
      <p className="text-xs text-gray-500">
        Puedes subir hasta 4 imágenes. La primera será la portada.
      </p>
    </div>
  )
}