// src/components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaGoogle } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Coluna 1: Institucional - OTIMIZADA PARA MOBILE */}
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="inline-block h-auto w-40 mx-auto md:mx-0">
              <Logo />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
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
          </div>

          {/* Coluna 2: Navegação (Mapa do Site) - OTIMIZADA PARA MOBILE */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-m2-green transition-colors">Início</Link></li>
              <li><Link href="/sobre" className="text-gray-400 hover:text-m2-green transition-colors">Sobre Nós</Link></li>
              <li><Link href="/servicos" className="text-gray-400 hover:text-m2-green transition-colors">Serviços</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-m2-green transition-colors">Portfólio</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-m2-green transition-colors">Blog</Link></li>
              <li><Link href="/contato" className="text-gray-400 hover:text-m2-green transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Mapa - OTIMIZADA PARA MOBILE */}
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
              <li className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">Taubaté - SP e Região</span>
              </li>
            </ul>
            
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-800">
                <iframe 
                    src="https://maps.google.com/maps?q=Av.%20Dom%20Duarte%20Leopoldo%20e%20Silva,%20131%20-%20Vila%20S%C3%A3o%20Jos%C3%A9,%20Taubat%C3%A9%20-%20SP,%2012070-590&t=&z=12&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="150" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    // Filtro CSS para deixar o mapa com tema escuro
                    className="filter invert(1) hue-rotate(180deg)"
                ></iframe>
            </div>
          </div>
        </div>

        {/* Linha Final: Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} M2 Projecta | Todos os direitos reservados.| Desenvolvido por <a href="https://www.instagram.com/levbrands/" target="_blank" rel="noopener noreferrer" aria-label="Instagram do desenvolvedor do site" className="hover:text-m2-green transition-colors">LEV.B - Marketing 360º</a>
          </p>
        </div>

      </div>
    </footer>
  );
};