import { Metadata } from 'next'
import MarcaTable from '@/components/categorias/table'
import Search from '@/components/search';

// 1. Definimos la estructura de la categoría
export interface Categoria {
  id: string | number;
  nombre: string;
  // Añade aquí otras propiedades que uses, por ejemplo:
  // descripcion?: string;
  // imagen?: string;
}

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Administración de categorías del salón',
}

export default async function CategoriasPage() {
  // 2. Usamos la interface en lugar de any[]
  const categorias: Categoria[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-900">
          Categorias
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Search placeholder="Buscar categorias..." />
      </div>

      <MarcaTable categorias={categorias} />
    </div>
  )
}