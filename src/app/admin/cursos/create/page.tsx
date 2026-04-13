import CursoForm from '@/components/cursos/form'

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-900">Nuevo Curso</h1>
      <CursoForm />
    </div>
  )
}