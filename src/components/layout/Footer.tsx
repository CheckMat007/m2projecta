// src/components/layout/Footer.tsx

import React from 'react';
import { FaInstagram, FaYoutube, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4">
            <a href="#home" className="inline-block h-auto w-52 mx-auto md:mx-0">
              <Logo />
            </a>
            <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
              Capturando o mundo por ângulos que inspiram. A M2 Projecta transforma visões em realidade com imagens aéreas de tirar o fôlego.
            </p>
          </div>

          {/* Coluna 2: Links do Site (Navegação) */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <a href="#sobre" className="group text-gray-400 hover:text-m2-green transition-colors inline-block">
                  <span className="relative">
                    Sobre Nós
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="#servicos" className="group text-gray-400 hover:text-m2-green transition-colors inline-block">
                  <span className="relative">
                    Serviços
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="#portfolio" className="group text-gray-400 hover:text-m2-green transition-colors inline-block">
                  <span className="relative">
                    Portfólio
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="#contato" className="group text-gray-400 hover:text-m2-green transition-colors inline-block">
                  <span className="relative">
                    Contato
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contatos e Redes Sociais (COM EFEITO DE SUBLINHADO) */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start group">
                <FaEnvelope className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="mailto:contato@m2projecta.com.br" className="relative text-gray-400 group-hover:text-m2-green transition-colors">
                  contato@m2projecta.com.br
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <FaWhatsapp className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="relative text-gray-400 group-hover:text-m2-green transition-colors">
                  WhatsApp (12) 99131-6774
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <FaInstagram className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" className="relative text-gray-400 group-hover:text-m2-green transition-colors">
                  @m2projecta
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <FaYoutube className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://www.youtube.com/@M2Projecta" target="_blank" rel="noopener noreferrer" className="relative text-gray-400 group-hover:text-m2-green transition-colors">
                  YouTube
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Final: Copyright e Créditos */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            <span className="text-m2-green">&copy; 2025 M2PROJECTA.</span> Todos os direitos reservados.
          </p>
          <p className="mt-1">
            Desenvolvido por <a href="https://www.instagram.com/levbrands/" target="_blank" rel="noopener noreferrer" aria-label="Instagram do desenvolvedor do site" className="hover:text-m2-green transition-colors">LEV.B - Marketing 360º</a>
          </p>
        </div>

      </div>
    </footer>
  );
};