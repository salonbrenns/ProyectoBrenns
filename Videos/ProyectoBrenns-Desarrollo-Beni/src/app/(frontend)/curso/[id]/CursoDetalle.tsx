"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Curso = {
  id: number
  titulo: string
  descripcion: string | null
  precio_total: number
  nivel: string | null
  duracion_horas: number | null
  cupo_maximo: number
  inscritos: number
  fecha_inicio: string | null
  fecha_fin: string | null
  imagenes: string[]
}

const nivelColor: Record<string, string> = {
  basico: "bg-emerald-100 text-emerald-700",
  intermedio: "bg-amber-100 text-amber-700",
  avanzado: "bg-rose-100 text-rose-700",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const IconoCandado = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconoCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function CursoDetalle({ curso, isLoggedIn = false }: { curso: Curso; isLoggedIn?: boolean }) {
  const imagenes = curso.imagenes || []
  const [imagenActiva, setImagenActiva] = useState(imagenes[0] || null)
  const [inscrito, setInscrito] = useState(false)
  const router = useRouter()

  const cupoDisponible = curso.cupo_maximo - curso.inscritos
  const porcentajeOcupado = Math.round((curso.inscritos / curso.cupo_maximo) * 100)
  const nivelKey = (curso.nivel || "").toLowerCase()

  const handleInscripcion = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    setInscrito(!inscrito)
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: "linear-gradient(135deg, #fff5f7 0%, #ffeef5 40%, #f5f0ff 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .curso-wrap { font-family: 'DM Sans', sans-serif; }
        .curso-titulo { font-family: 'Playfair Display', serif; }

        .thumb-btn { transition: all 0.2s ease; }
        .thumb-btn:hover { transform: scale(1.05); }
        .thumb-btn.active { box-shadow: 0 0 0 3px #e91e8c; }

        .btn-inscribir {
          background: #2d3a4a;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 16px 36px;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(45,58,74,0.25);
        }
        .btn-inscribir:hover:not(:disabled) {
          background: #1e2a38;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,58,74,0.35);
        }
        .btn-inscribir:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-inscribir:disabled {
          background: #b0b8c1;
          box-shadow: none;
          cursor: not-allowed;
        }
        .btn-inscribir.inscrito {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 6px 24px rgba(16,185,129,0.35);
        }
        .btn-inscribir svg {
          flex-shrink: 0;
          opacity: 0.9;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #999;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .progress-bar-bg {
          background: #f0e6ef;
          border-radius: 999px;
          height: 8px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #e91e8c, #ff6bac);
          transition: width 0.6s ease;
        }

        .badge-nivel {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: capitalize;
        }
      `}</style>

      <div className="max-w-6xl mx-auto curso-wrap">

        {/* Breadcrumb */}
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 text-pink-600 mb-8 text-sm font-medium hover:text-pink-800 transition-colors"
        >
          ← Volver a cursos
        </Link>

        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-6">

            {/* Main image */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-xl"
              style={{ aspectRatio: "16/10", background: "#f0e8f0" }}
            >
              {imagenActiva ? (
                <Image src={imagenActiva} alt={curso.titulo} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-7xl">🎓</div>
              )}
              {curso.nivel && (
                <div className="absolute top-4 left-4">
                  <span className={`badge-nivel ${nivelColor[nivelKey] ?? "bg-gray-100 text-gray-600"}`}>
                    {curso.nivel}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagenes.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImagenActiva(img)}
                    className={`thumb-btn w-20 h-20 relative rounded-xl overflow-hidden ${imagenActiva === img ? "active" : ""}`}
                  >
                    <Image src={img} alt={`Vista ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Descripción */}
            {curso.descripcion && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              >
                <h2 className="curso-titulo text-lg font-semibold mb-3" style={{ color: "#1a1a2e" }}>
                  Acerca del curso
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">{curso.descripcion}</p>
              </div>
            )}
          </div>

          {/* ── RIGHT: Info card ── */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-6 sticky top-8"
            style={{
              background: "white",
              boxShadow: "0 8px 40px rgba(233,30,140,0.10), 0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            {/* Title + precio */}
            <div>
              <h1 className="curso-titulo text-3xl font-bold mb-1" style={{ color: "#1a1a2e" }}>
                {curso.titulo}
              </h1>
              <p className="text-3xl font-bold mt-3" style={{ color: "#e91e8c" }}>
                ${Number(curso.precio_total).toLocaleString("es-MX")}
                <span className="text-base font-normal text-gray-400 ml-1">MXN</span>
              </p>
            </div>

            {/* Cupo */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Disponibilidad</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: cupoDisponible <= 3 ? "#e91e8c" : "#1a1a2e" }}
                >
                  {cupoDisponible} lugar{cupoDisponible !== 1 ? "es" : ""} disponible{cupoDisponible !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${porcentajeOcupado}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {curso.inscritos} de {curso.cupo_maximo} inscritos
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {curso.nivel && (
                <div className="stat-card">
                  <span className="stat-label">Nivel</span>
                  <span className="stat-value capitalize">{curso.nivel}</span>
                </div>
              )}
              {curso.duracion_horas && (
                <div className="stat-card">
                  <span className="stat-label">Duración</span>
                  <span className="stat-value">{curso.duracion_horas} hrs</span>
                </div>
              )}
              {curso.fecha_inicio && (
                <div className="stat-card col-span-2">
                  <span className="stat-label">Inicio</span>
                  <span className="stat-value">{formatDate(curso.fecha_inicio)}</span>
                </div>
              )}
              {curso.fecha_fin && (
                <div className="stat-card col-span-2">
                  <span className="stat-label">Fin</span>
                  <span className="stat-value">{formatDate(curso.fecha_fin)}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0e6ef" }} />

            {/* Botón */}
            <button
              className={`btn-inscribir ${inscrito ? "inscrito" : ""}`}
              disabled={cupoDisponible === 0 && !inscrito}
              onClick={handleInscripcion}
            >
              {inscrito ? (
                <>
                  <IconoCheck />
                  ¡Inscrito exitosamente!
                </>
              ) : cupoDisponible === 0 ? (
                <>
                  <IconoCandado />
                  Sin cupo disponible
                </>
              ) : (
                <>
                  <IconoCandado />
                  {isLoggedIn ? "Inscribirme ahora" : "Inicia sesión para inscribirte"}
                </>
              )}
            </button>

            {cupoDisponible > 0 && cupoDisponible <= 5 && !inscrito && (
              <p className="text-center text-xs font-medium" style={{ color: "#e91e8c" }}>
                ⚡ ¡Quedan pocos lugares!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}