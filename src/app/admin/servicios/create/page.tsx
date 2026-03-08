// src/app/admin/servicios/create/page.tsx
import { Metadata } from 'next'
import ServicioForm from '@/components/servicios/form'

export const metadata: Metadata = { title: 'Nuevo Servicio' }

export default function CreateServicioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-900">Nuevo Servicio</h1>
      <ServicioForm />
    </div>
  )
}