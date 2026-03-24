import { PartyPopper, Sparkles } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-pink-600 to-pink-400 text-white py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-3">
        <PartyPopper className="w-5 h-5 text-white" />
        <span className="font-semibold text-sm sm:text-base tracking-wide">
          ¡Super Oferta del Día! — 20% de descuento en Material de Uñas
        </span>
        <Sparkles className="w-5 h-5 text-white" />
      </div>

      {/* Animación */}
      <style>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 12s linear infinite;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
