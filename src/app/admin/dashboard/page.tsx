import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Página principal del administrador',
}

export default async function DashboardPage() {
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-900">
        Bienvenid@, 
      </h1>

      <p className="text-sm text-gray-600">
        Desde este panel puedes administrar las diferentes secciones del sistema.
        Aquí tienes un resumen general del sistema.
      </p>
      </div>
    
  )
}