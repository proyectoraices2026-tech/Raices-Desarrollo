import React from 'react';
import { Link } from 'react-router-dom';
import iconoRaices from '../assets/iconoraicesblanco.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4a6b53] text-white py-6 border-t border-[#3e5a45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo y Nombre */}
          <div className="flex items-center gap-1.5">
            <img 
              src={iconoRaices} 
              alt="Raíces Logo" 
              className="h-7 w-auto object-contain" 
            />
            <span className="text-2xl font-semibold text-white">Raíces</span>
          </div>

          {/* Enlaces de interés / Redes sociales */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-50">
            <Link to="/about" className="hover:underline transition-all">
              Sobre Nosotros / Contáctanos
            </Link>
            <Link to="/terms" className="hover:underline transition-all">
              Términos y Condiciones
            </Link>
            <a 
              href="https://www.instagram.com/raices_palmares?stkn=MTNoZjh4Mzg0OWxueg%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              {/* Icono de Instagram */}
              <svg 
                className="w-4 h-4 fill-current" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>
          </div>

        </div>

        {/* Derechos de autor */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-emerald-100/70">
          <p>© {new Date().getFullYear()} Raíces - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;