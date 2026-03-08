// middleware.ts — RAÍZ del proyecto (junto a auth.ts)
import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const session     = req.auth
  const isLoggedIn  = !!session
  const path        = nextUrl.pathname
  const role        = session?.user?.role

  // ── Rutas de Admin ──────────────────────────────────────────
  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/login", nextUrl.origin)
      url.searchParams.set("next", path)
      return NextResponse.redirect(url)
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl.origin))
    }
  }

  // ── Rutas de Docente ────────────────────────────────────────
  if (path.startsWith("/docente")) {
    if (!isLoggedIn) {
      const url = new URL("/login", nextUrl.origin)
      url.searchParams.set("next", path)
      return NextResponse.redirect(url)
    }
    if (role !== "DOCENTE" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl.origin))
    }
  }

  // ── Rutas privadas de cliente ───────────────────────────────
  const rutasCliente = [
    "/perfil",
    "/carrito",
    "/checkout",
    "/pago",
    "/mis-cursos",
    "/agendar",
    "/inscribirse",
  ]

  const esRutaCliente = rutasCliente.some(r => path.startsWith(r))
  if (esRutaCliente && !isLoggedIn) {
    const url = new URL("/login", nextUrl.origin)
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/docente/:path*",
    "/perfil/:path*",
    "/carrito/:path*",
    "/checkout/:path*",
    "/pago/:path*",
    "/mis-cursos/:path*",
    "/agendar/:path*",
    "/inscribirse/:path*",
  ],
}