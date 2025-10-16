// src/app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importe o componente Image

// Removemos a definição do componente DroneIcon daqui

export default function NotFound() {
  const router = useRouter();

  return (
    // 1. COR DE FUNDO ATUALIZADA AQUI
    <div className="bg-[#2e2c2c] min-h-screen flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden">
      
      {/* 2. IMAGEM SUBSTITUINDO O DRONE SVG */}
      <div className="mb-4">
        <Image 
          src="/assets/icone.png" // <-- Coloque o caminho para a sua imagem aqui
          alt="Ilustração de um drone de busca"
          width={180} // Ajuste a largura conforme necessário
          height={180} // Ajuste a altura conforme necessário
          className="animate-search-float" // Usando a animação de flutuar que já temos
        />
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-white uppercase">
        4<span className="text-m2-green">0</span>4
      </h1>

      <p className="mt-4 text-xl md:text-2xl font-bold text-gray-300">Página Não Encontrada</p>
      <p className="mt-2 max-w-sm text-gray-400">
        Nosso drone de busca procurou por toda parte, mas não conseguiu encontrar as coordenadas desta página.
      </p>

      <button 
        onClick={() => router.back()}
        className="mt-10 bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block"
      >
        Voltar para a página anterior
      </button>
    </div>
  );
}