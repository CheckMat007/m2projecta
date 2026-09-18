// src/app/not-found.tsx
import Image from 'next/image';
import { BackButton } from '@/components/BackButton';
import type { Metadata } from 'next';

// Componente de servidor (o antigo era 'use client' e por isso não podia exportar
// metadata — a página 404 herdava o título padrão do layout raiz, igual ao da home).
// A interatividade (botão "voltar") foi isolada em BackButton.
export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="bg-[#2e2c2c] min-h-screen flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden">

      <div className="mb-4">
        <Image
          src="/assets/icone.png"
          alt="Ilustração de um drone de busca"
          width={180}
          height={180}
          className="animate-search-float"
        />
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-white uppercase">
        4<span className="text-m2-green">0</span>4
      </h1>

      <p className="mt-4 text-xl md:text-2xl font-bold text-gray-300">Página Não Encontrada</p>
      <p className="mt-2 max-w-sm text-gray-400">
        Nosso drone de busca procurou por toda parte, mas não conseguiu encontrar as coordenadas desta página.
      </p>

      <BackButton className="mt-10 bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block">
        Voltar para a página anterior
      </BackButton>
    </div>
  );
}
