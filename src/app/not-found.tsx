// src/app/not-found.tsx

import Link from 'next/link';

// O componente DroneIcon continua o mesmo
const DroneIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="120" 
    height="120" 
    viewBox="0 0 100 100"
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-gray-400" // Cor um pouco mais visível
  >
    <rect x="30" y="40" width="40" height="20" rx="5" fill="currentColor" />
    <line x1="30" y1="40" x2="15" y2="25" />
    <line x1="70" y1="40" x2="85" y2="25" />
    <line x1="30" y1="60" x2="15" y2="75" />
    <line x1="70" y1="60" x2="85" y2="75" />
    <g>
      <circle cx="15" cy="25" r="4" fill="currentColor" />
      <circle cx="15" cy="25" r="10" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <g>
      <circle cx="85" cy="25" r="4" fill="currentColor" />
      <circle cx="85" cy="25" r="10" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <g>
      <circle cx="15" cy="75" r="4" fill="currentColor" />
      <circle cx="15" cy="75" r="10" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <g>
      <circle cx="85" cy="75" r="4" fill="currentColor" />
      <circle cx="85" cy="75" r="10" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <path d="M50 60 L30 85 L70 85 Z" fill="#97f901" stroke="none" className="opacity-30 animate-pulse"></path>
  </svg>
);


export default function NotFound() {
  return (
    <div className="bg-m2-dark min-h-screen flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden">
      
      {/* 1. DRONE ANIMADO (agora posicionado acima do texto) */}
      <div className="relative animate-fly-search mb-4">
        <DroneIcon />
      </div>

      {/* 2. TEXTO 404 */}
      <h1 className="text-6xl md:text-8xl font-black text-white uppercase">
       ERRO 4<span className="text-m2-green">0</span>4
      </h1>

      {/* 3. TEXTOS AUXILIARES E BOTÃO */}
      <p className="mt-4 text-xl md:text-2xl font-bold text-gray-300">Página Não Encontrada</p>
      <p className="mt-2 max-w-sm text-gray-400">
        Nosso drone de busca procurou por toda parte, mas não conseguiu encontrar as coordenadas desta página.
      </p>

      <Link 
        href="/" 
        className="mt-10 bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block"
      >
        Voltar para a Página Principal
      </Link>
    </div>
  );
}