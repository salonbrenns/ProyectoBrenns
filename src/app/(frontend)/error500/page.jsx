'use client'
import React from 'react';

export default function Error500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos de fondo - igual que en 404 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-300 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Título principal */}
        <h1
          className="text-pink-500 mb-2 animate-fade-in"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3.5rem, 9vw, 6rem)',
            fontWeight: '400',
            letterSpacing: '-0.03em',
          }}
        >
          Error 500
        </h1>

        <h2
          className="text-pink-600 mb-10 animate-fade-in-delay"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: '400',
            lineHeight: '1.25',
          }}
        >
          ¡Ups! El servidor se pintó las uñas... y se quedó pegado
        </h2>

        {/* Imagen temática - puedes cambiarla por otra si prefieres */}
        <div className="mb-10 animate-slide-up">
          <img
            src="/lampara.png"           // ← misma que usaste en 404 (o cámbiala por /server-down.png, /error-500-nails.jpg, etc.)
            alt="Lámpara UV o servidor en problemas"
            className="w-full max-w-md mx-auto drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(236, 72, 153, 0.25))',
            }}
          />
        </div>

        {/* Texto explicativo */}
        <p
          className="text-pink-600/80 mb-12 px-4 animate-fade-in-delay-2 leading-relaxed"
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: 'clamp(1.1rem, 2.4vw, 1.35rem)',
            fontWeight: '400',
          }}
        >
          Algo salió mal en el backend mientras preparaba tu pedido perfecto.<br />
          Nuestro equipo ya está limando el error y volverá en breve con todo el brillo.
        </p>

        {/* Botón de regreso */}
        <button
          onClick={() => window.location.href = '/'}
          className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 animate-bounce-in"
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: '1.25rem',
            fontWeight: '600',
            letterSpacing: '0.02em',
          }}
        >
          <span className="relative z-10">Volver al Inicio</span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Estilos y animaciones (exactamente iguales a tu 404) */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Crimson+Pro:wght@400;600&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes bounceIn {
          0%   { opacity: 0; transform: scale(0.8); }
          50%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}