'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Error404Page() {
  return (
    <div className="error-container">
      <div className="content">
        <h1 className="title">¡Oops! Parece que este tono ya no está en nuestro catálogo.</h1>

        <div className="image-wrapper">
          <Image
            src="/404.png"         
            alt="Error 404 - Página no encontrada"
            width={405}
            height={300}
            priority
            className="error-image"
          />
        </div>

        <p className="subtitle">
          Buscamos por todo el salón, pero no encontramos la página que intentas visitar.
        </p>
      </div>

  
      <button
        onClick={() => window.location.href = '/'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#F15B8A',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '999px',
          fontSize: '16px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(241, 91, 138, 0.35)',
          zIndex: 999999
        }}
      >
        Ir al Inicio
      </button>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FCEDE4;
          padding: 2rem;
          font-family: 'Quicksand', sans-serif;
          position: relative;
          overflow: visible;
        }

        .content {
          max-width: 900px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 400;
          color: #F15B8A;
          margin-bottom: 2rem;
          line-height: 1.3;
        }

        .image-wrapper {
          margin: 3rem auto;
          display: inline-block;
        }

        .error-image {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 40px rgba(241, 91, 138, 0.25));
          transition: transform 0.3s ease;
        }

        .error-image:hover {
           transform: none;
        }

        .subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 400;
          color: #F15B8A;
          margin: 2rem 0 3rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .image-wrapper {
            margin: 2rem auto;
          }
        }

        @media (max-width: 480px) {
          .floating-button {
            bottom: 1.2rem;
            right: 1.2rem;
            padding: 0.8rem 1.8rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}