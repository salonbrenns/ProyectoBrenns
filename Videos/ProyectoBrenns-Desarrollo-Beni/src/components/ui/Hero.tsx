import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-6">
         
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
            Tu Belleza,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">
              Nuestra Pasión
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Academia Brenn´s tiene como objetivo principal, educar con excelencia a las Manicuristas y Pedicuristas de Huejutla y sus Alrededores.
Además contamos con venta de material, a un costo accesible pero de excelente calidad.
Somos tu mejor opción.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
              Reservar Ahora
            </button>

            <button className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition">
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/logo/salon.jpg"
            alt="Foto del salón"
            width={800}
            height={800}
            className="w-full h-full object-contain" 
          />

          {/* Decoración */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-300 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-xl"></div>
        </div>

      </div>
    </section>
  );
}
