import ServiceCard from "./ServiceCard";
import { Scissors, Sparkles, Heart } from "lucide-react";

export default function Services() {
  const services = [
      {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Manicura & Pedicura",
      description: "Cuidado completo de manos y pies"
    },

    {
      icon: <Scissors className="w-12 h-12" />,
      title: "Corte y Peinado",
      description: "Estilismo profesional adaptado a tu personalidad"
    },
  
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Maquillaje Social",
      description: ""
    }
  ];

  return (
    <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Servicios</h3>
        <p className="text-gray-600 text-lg">Descubre la excelencia en cada tratamiento</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <ServiceCard key={i} {...s} />
        ))}
      </div>
    </section>
  );
}
