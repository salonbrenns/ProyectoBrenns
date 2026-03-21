import { MapPin, Facebook, Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4">BRENN'S</h4>
            <p className="text-gray-400">
              Somos tu mejor opción en belleza y educación profesional en Huejutla.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicación
            </h5>
            <p className="text-gray-400">
              Zona Centro, calle Juan Mogica Ugalde 5A<br />
              (Una calle detrás del cine, donde antes era uniformes Bekita)<br />
              Huejutla de Reyes, Hidalgo
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Redes Sociales</h5>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition cursor-pointer">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition cursor-pointer">
                <Phone className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Brenn's. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
