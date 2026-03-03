import { Metadata } from 'next'
import ProductoTable from '@/components/productos/table'
import Search from '@/components/search'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Administración de productos del salón',
}
/*interface Props {
  searchParams: {
    page?: string
  }
}*/

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {

  const params = await searchParams

  const page = Number(params.page) || 1
  const take = 10
  const skip = (page - 1) * take

  const totalProductos = await prisma.producto.count()

  const productosRaw = await prisma.producto.findMany({
    select: {
      id: true,
      codigo: true,
      nombre: true,
      descripcion: true,
      precio_venta: true,
      stock: true,
      activo: true,
      marca: {
        select: { nombre: true }
      }
    },
    orderBy: { id: 'asc' },
    take,
    skip
  })

  const productos = productosRaw.map(p => ({
    ...p,
    precio_venta: Number(p.precio_venta)
  }))

  const totalPages = Math.ceil(totalProductos / take)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-900">
          Productos
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Search placeholder="Buscar productos..." />
      </div>

      <ProductoTable
        productos={productos}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}