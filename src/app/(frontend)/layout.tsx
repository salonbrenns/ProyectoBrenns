// src/app/(frontend)/layout.tsx
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../globals.css"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Bren's - Evaluación de Prototipos",
  description: "Sistema integral de evaluación UX",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased bg-[#F9F9F9] text-[#4A4A4A] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
