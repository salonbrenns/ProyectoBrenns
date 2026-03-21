import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    // Demo: en una app real validas contra la base de datos
    // Aquí extraemos el nombre del email (primera parte antes del @)
    const nombreFromEmail = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
    
    const token = `demo-token-${email}`
    return NextResponse.json({ 
      token, 
      user: { 
        email,
        nombre: nombreFromEmail,
        fechaRegistro: new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long" })
      } 
    })
  } catch (err) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }
}
