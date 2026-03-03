import Hero from '@/components/ui/Hero';
import Services from '@/components/ui/Services';
import Stats from '@/components/ui/Stats';
import PromoBanner from '@/components/ui/PromoBanner';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <PromoBanner /> 
      <Hero />
      <Services />
      
      {/* Sección de Catálogo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Catálogo de Productos</h3>
          <p className="text-gray-600 text-lg mb-8">Descubre nuestra tienda completa de productos de belleza y accesorios profesionales</p>
          <Link href="/tienda">
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
              Ir al Catálogo Completo
            </button>
          </Link>
        </div>
      </section>

      <Stats />
    </div>
  );
}
