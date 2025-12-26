// src/components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaGoogle } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-8 pb-2">
      <div className="container mx-auto px-6">
        {/* Container principal com 3 colunas para desktop */}
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Coluna 1: Institucional (com botão) */}
          <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block h-auto w-40">
              <Logo />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Perspectivas que impressionam, resultados que impactam. Capturamos a essência do seu projeto com imagens aéreas de tirar o fôlego.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
              <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da M2 Projecta" className="text-gray-400 hover:text-m2-green transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.youtube.com/@M2Projecta" target="_blank" rel="noopener noreferrer" aria-label="YouTube da M2 Projecta" className="text-gray-400 hover:text-m2-green transition-colors">
                <FaYoutube size={24} />
              </a>
              <a href="https://tiktok.com/@m2.projecta" target="_blank" rel="noopener noreferrer" aria-label="TikTok da M2 Projecta" className="text-gray-400 hover:text-m2-green transition-colors">
                <FaTiktok size={24} />
              </a>
              <a href="https://share.google/Y49eW19m18AuxopSj" target="_blank" rel="noopener noreferrer" aria-label="Google da M2 Projecta" className="text-gray-400 hover:text-m2-green transition-colors">
                <FaGoogle size={24} />
              </a>
            </div>
            <div className="pt-4">
              <Link 
                href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" 
                className="bg-m2-green text-black font-bold py-3 px-6 rounded-lg text-base hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block"
              >
                Solicite um Orçamento
              </Link>
            </div>
          </div>

          {/* Coluna 2: Navegação (DIVIDIDA EM DUAS SUB-COLUNAS) */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Navegação</h3>
            {/* Container para as duas listas de links */}
            <div className="grid grid-cols-2 gap-2">
              {/* Sub-coluna 1: Links Principais */}
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-m2-green transition-colors">Início</Link></li>
                <li><Link href="/sobre" className="text-gray-400 hover:text-m2-green transition-colors">Sobre Nós</Link></li>
                <li><Link href="/servicos" className="text-gray-400 hover:text-m2-green transition-colors">Serviços</Link></li>
                <li><Link href="/portfolio" className="text-gray-400 hover:text-m2-green transition-colors">Portfólio</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-m2-green transition-colors">Blog</Link></li>
                <li><Link href="/contato" className="text-gray-400 hover:text-m2-green transition-colors">Contato</Link></li>
              </ul>
              {/* Sub-coluna 2: Links Legais */}
              <ul className="space-y-3">
                <li><Link href="/politica-de-privacidade" className="text-gray-400 hover:text-m2-green transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos-e-condicoes" className="text-gray-400 hover:text-m2-green transition-colors">Termos e Condições</Link></li>
              </ul>
            </div>
          </div>

          {/* Coluna 3: Contato e Mapa */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start group">
                <FaEnvelope className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="mailto:contato@m2projecta.com.br" className="text-gray-400 group-hover:text-m2-green transition-colors">contato@m2projecta.com.br</a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <FaWhatsapp className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://wa.me/5512991316774" target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover:text-m2-green transition-colors">(12) 99131-6774</a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <FaMapMarkerAlt className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://maps.app.goo.gl/294jFDWsKwSS7z479" target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover:text-m2-green transition-colors">Taubaté - SP e Região</a> 
              </li>
            </ul>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-800">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14689.209432526159!2d-45.539243!3d-23.012668!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ccf924bd36207f%3A0x2b25ebe353538146!2sM2%20Projecta!5e0!3m2!1spt-BR!2sbr!4v1766790677208!5m2!1spt-BR!2sbr"
                    width="100%" 
                    height="150" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="filter invert(1) hue-rotate(180deg)"
                ></iframe>
            </div>
          </div>
        </div>

        {/* Linha Final: Copyright */}
        <div className="mt-8 pt-2 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} M2 Projecta - Todos os direitos reservados. | Desenvolvido por <a href="https://www.instagram.com/levbrands/" target="_blank" rel="noopener noreferrer" aria-label="Instagram do desenvolvedor do site" className="hover:text-m2-green transition-colors">LEV.B - Marketing 360º</a>
          </p>
        </div>

      </div>
    </footer>
  );
};