// src/components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaGoogle } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-6">
        
        {/* Container principal com 3 colunas para desktop */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 text-center md:text-left">
          
          {/* Coluna 1: Institucional */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link 
              href="/" 
              className="relative h-14 w-44 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded"
              aria-label="Voltar para a página inicial"
            >
              <Image 
                src="/logo_2.png" 
                alt="Logotipo M2 Projecta"
                fill
                sizes="(max-width: 768px) 176px, 176px"
                className="object-contain object-center md:object-left"
                loading="lazy"
                quality={75}
              />
            </Link>
            
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Perspectivas que impressionam, resultados que impactam. Capturamos a essência do seu projeto com imagens aéreas de tirar o fôlego.
            </p>
            
            <div className="flex items-center space-x-5 pt-2">
              <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" aria-label="Acessar Instagram da M2 Projecta" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-full transition-colors">
                <FaInstagram size={24} aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/@M2Projecta" target="_blank" rel="noopener noreferrer" aria-label="Acessar YouTube da M2 Projecta" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-full transition-colors">
                <FaYoutube size={24} aria-hidden="true" />
              </a>
              <a href="https://tiktok.com/@m2.projecta" target="_blank" rel="noopener noreferrer" aria-label="Acessar TikTok da M2 Projecta" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-full transition-colors">
                <FaTiktok size={24} aria-hidden="true" />
              </a>
              <a href="https://share.google/Y49eW19m18AuxopSj" target="_blank" rel="noopener noreferrer" aria-label="Ver avaliações no Google" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-full transition-colors">
                <FaGoogle size={24} aria-hidden="true" />
              </a>
            </div>

            <div className="pt-2 w-full flex justify-center md:justify-start">
              <a 
                href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-m2-green text-black font-bold py-3 px-6 rounded-lg text-base hover:bg-white transition-all duration-300 transform hover:scale-105 inline-block shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-m2-green"
              >
                Solicite um Orçamento
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação (Corrigida estruturalmente) */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            {/* Bloco 1: Menu Principal */}
            <div className="w-full">
              <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Navegação</h3>
              <ul className="space-y-3">
                {['Início', 'Sobre Nós', 'Serviços', 'Portfólio', 'Blog', 'Contato'].map((item) => {
                  const href = item === 'Início' ? '/' : `/${item.toLowerCase().replace(' ', '-').replace('ó', 'o')}`;
                  return (
                    <li key={item}>
                      <Link href={href} className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 -ml-1 transition-colors">
                        {item}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            {/* Bloco 2: Legal (Separado semanticamente em bloco vertical) */}
            <div className="w-full">
              <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/politica-de-privacidade" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 -ml-1 transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos-e-condicoes" className="text-gray-400 hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 -ml-1 transition-colors">Termos e Condições</Link></li>
              </ul>
            </div>
          </div>

          {/* Coluna 3: Contato e Mapa */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center group">
                <FaEnvelope className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:contato@m2projecta.com.br" className="text-gray-400 group-hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 transition-colors">contato@m2projecta.com.br</a>
              </li>
              <li className="flex items-center group">
                <FaWhatsapp className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <a href="https://wa.me/5512991316774" target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 transition-colors">(12) 99131-6774</a>
              </li>
              <li className="flex items-center group">
                <FaMapMarkerAlt className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <a href="https://maps.google.com/?q=Taubaté+SP" target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 transition-colors">Taubaté - SP e Região</a> 
              </li>
            </ul>
            
            <div className="w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14689.209432526159!2d-45.539243!3d-23.012668!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ccf924bd36207f%3A0x2b25ebe353538146!2sM2%20Projecta!5e0!3m2!1spt-BR!2sbr!4v1766790677208!5m2!1spt-BR!2sbr"
                width="100%" 
                height="150" 
                title="Mapa de localização M2 Projecta em Taubaté"
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert(1) hue-rotate(180deg) opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Linha Final: Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-center items-center gap-2">
          <p>
            © {new Date().getFullYear()} M2 Projecta - Todos os direitos reservados.
          </p>
          <span className="hidden md:inline">|</span>
          <p>
            Desenvolvido por <a href="https://www.levbrands.com.br" target="_blank" rel="noopener noreferrer" aria-label="Visitar site do desenvolvedor LEV.B" className="text-white hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 transition-colors">LEV.B - Marketing 360º</a>
          </p>
        </div>

      </div>
    </footer>
  );
};