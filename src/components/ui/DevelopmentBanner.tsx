// src/components/ui/DevelopmentBanner.tsx
import { Wrench } from 'lucide-react';

export default function DevelopmentBanner() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-center p-3 
                   bg-white-950 border-green-500/30 ">
      
      <div className="flex items-center gap-3 text-center">
        <Wrench className="w-5 h-5 text-green-400 flex-shrink-0" />
        
        {/* A MUDANÇA ESTÁ AQUI: Juntamos os dois parágrafos em um só. */}
        <p className="text-sm text-gray-200">
          <strong className="font-semibold text-white">Versão de Demonstração:</strong> Este site está em desenvolvimento. |
          {' '} {/* Adiciona um espaço */}
          <a href="https://www.instagram.com/levbrands/" target="_blank" rel="noopener noreferrer">
            <strong className="font-semibold text-white hover:text-green-300">LEV.B - Marketing 360°</strong>
          </a>
        </p>

      </div>
    </div>
  );
}