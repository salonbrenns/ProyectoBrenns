import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ServicioCardProps {
  id: string
  titulo: string
  descripcion: string
  duracion: string
  precio: string
  rating: number
  categoria: string
}

export default function ServicioCard({ id, titulo, descripcion, duracion, precio, rating, categoria }: ServicioCardProps) {
  return (
    <Link href={`/servicio/${id}`}>
      <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/95">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="mb-2">{categoria}</Badge>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
            {titulo}
          </CardTitle>
          <CardDescription className="line-clamp-2">{descripcion}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duracion}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">{precio}</p>
            <p className="text-xs text-muted-foreground">por sesión</p>
          </div>
          <Button className="group-hover:bg-purple-600 transition-colors">
            Ver detalle <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}