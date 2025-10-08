// src/app/page.tsx
'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <main>
      {/* CABEÇALHO E NAVEGAÇÃO */}
      <header id="home" className="bg-black/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="inline-block">
            <Logo />
          </a>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#sobre" className="hover:text-m2-green transition-colors duration-300">Sobre</a>
            <a href="#servicos" className="hover:text-m2-green transition-colors duration-300">Serviços</a>
            <a href="#portfolio" className="hover:text-m2-green transition-colors duration-300">Portfólio</a>
            <a href="#contato" className="hover:text-m2-green transition-colors duration-300">Contato</a>
          </nav>
          <a href="#" className="hidden md:inline-block bg-m2-green text-black font-bold py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
            Área do Cliente
          </a>
          <button id="mobile-menu-button" className="md:hidden text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path></svg>
          </button>
        </div>
        <div id="mobile-menu" className={`md:hidden px-6 pt-2 pb-4 space-y-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <a href="#sobre" onClick={handleLinkClick} className="block hover:text-m2-green transition-colors duration-300">Sobre</a>
          <a href="#servicos" onClick={handleLinkClick} className="block hover:text-m2-green transition-colors duration-300">Serviços</a>
          <a href="#portfolio" onClick={handleLinkClick} className="block hover:text-m2-green transition-colors duration-300">Portfólio</a>
          <a href="#contato" onClick={handleLinkClick} className="block hover:text-m2-green transition-colors duration-300">Contato</a>
          <a href="#" onClick={handleLinkClick} className="block bg-m2-green text-black text-center font-bold mt-4 py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
            Área do Cliente
          </a>
        </div>
      </header>

      {/* VÍDEO FIXO NO FUNDO */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed top-0 left-0 w-full h-screen object-cover z-[-1]"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>
      
      {/* SEÇÃO HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
        <div className="relative z-20 text-center container mx-auto px-6">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-wider leading-tight mb-4">
            Perspectivas que <span className="text-m2-green">Impressionam</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 mb-8">
            Capturamos imagens aéreas de alta definição para elevar o nível do seu projeto, evento ou negócio.
          </p>
          <a href="#contato" className="bg-m2-green text-black font-bold py-4 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block">
            Solicite um Orçamento
          </a>
        </div>
      </section>

      {/* SEÇÃO SOBRE */}
      <section id="sobre" className="py-20 bg-black">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image src="https://placehold.co/600x400/111111/97f901?text=M2+Projecta+Equipe" alt="Equipe da M2 Projecta com drone" width={600} height={400} className="rounded-lg shadow-lg w-full h-auto" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 uppercase">Sobre a <span className="text-m2-green">M2 Projecta</span></h2>
            <p className="text-gray-300 mb-4">
              Somos apaixonados por tecnologia e narrativa visual. A M2 Projecta nasceu do desejo de oferecer uma nova perspectiva para o mercado, utilizando drones de última geração para criar vídeos e fotos que não apenas documentam, mas contam histórias.
            </p>
            <p className="text-gray-300 mb-4">
              Nossa equipe é formada por pilotos certificados e videomakers experientes, garantindo segurança, qualidade e um resultado final que supera as expectativas. Para nós, cada projeto é único e tratado com a máxima dedicação.
            </p>
            <p className="text-gray-300 mb-4">
              Todos nossos voos são regulamentados de acordo com a legislação em vigor, seguindo as normas estabelecidas pelo Departamento de Controle do Espaço Aéreo (DECEA), como emissão do plano de voo e autorização de decolagem.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO SERVIÇOS */}
      <section id="servicos" className="py-20 bg-m2-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase">Nossos <span className="text-m2-green">Serviços</span></h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Soluções completas em filmagem aérea para diversas necessidades.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Construção Civil</h3>
                        <p className="text-gray-400">Acompanhamento de obras, inspeções técnicas e marketing imobiliário.</p>
                    </div>
                    <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
                         <div className="flex justify-center mb-4">
                           <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Vídeos Corporativos</h3>
                        <p className="text-gray-400">Produção de vídeos institucionais com imagens aéreas impactantes.</p>
                    </div>
                    <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Cobertura de Eventos</h3>
                        <p className="text-gray-400">Registros aéreos de shows, casamentos, eventos esportivos e mais.</p>
                    </div>
                     <div className="bg-gray-900 p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Mapeamento Aéreo</h3>
                        <p className="text-gray-400">Topografia, agricultura de precisão e mapeamento de áreas.</p>
                    </div>
                </div>
            </div>
        </section>

      {/* SEÇÃO PORTFÓLIO */}
      <section id="portfolio" className="py-20 bg-black">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold uppercase">Nosso <span className="text-m2-green">Portfólio</span></h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Veja alguns dos projetos incríveis que já realizamos.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/000/FFF?text=Vídeo+Imobiliário" alt="Projeto 1" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">Edifício SkyTower</h3>
                            <p className="text-m2-green">Marketing Imobiliário</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/333/FFF?text=Evento+Musical" alt="Projeto 2" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">Festival MusicVibe</h3>
                            <p className="text-m2-green">Cobertura de Evento</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/111/FFF?text=Obra+Industrial" alt="Projeto 3" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">Inspeção Industrial</h3>
                            <p className="text-m2-green">Acompanhamento de Obra</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/222/FFF?text=Casamento" alt="Projeto 4" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">Casamento na Praia</h3>
                            <p className="text-m2-green">Cobertura de Evento Social</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/444/FFF?text=Vídeo+Institucional" alt="Projeto 5" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">AgroTech Corp</h3>
                            <p className="text-m2-green">Vídeo Corporativo</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                    <Image src="https://placehold.co/600x400/555/FFF?text=Mapeamento+de+Área" alt="Projeto 6" width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                            <h3 className="text-xl font-bold">Fazenda Verde</h3>
                            <p className="text-m2-green">Mapeamento para Agricultura</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-12">
                <a href="#" className="text-gray-500 text-sm hover:text-white">Acesso Restrito: Gerenciar Portfólio</a>
            </div>
        </div>
      </section>

      {/* SEÇÃO DE CONTATO */}
      <section id="contato" className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Fale <span className="text-m2-green">Conosco</span></h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Pronto para iniciar seu projeto? Envie uma mensagem e vamos transformar sua ideia em realidade.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-mail</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-300">Tipo de Serviço</label>
                <select id="service" name="service" className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green">
                  <option>Selecione um serviço</option>
                  <option>Construção Civil</option>
                  <option>Vídeo Corporativo</option>
                  <option>Cobertura de Evento</option>
                  <option>Mapeamento Aéreo</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Mensagem</label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-m2-green text-black font-bold py-3 px-10 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105">
                  Enviar Mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* RODAPÉ ATUALIZADO */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <div className="mb-4">
            <a href="#home" className="inline-block">
              <Logo />
            </a>
          </div>
          <p className="mb-4">
            <a className="hover:text-m2-green transition-colors duration-300">&copy; 2025 M2PROJECTA.</a> Todos os direitos reservados. | Desenvolvido por <a href="https://www.instagram.com/levbrands/" target="_blank" rel="noopener noreferrer" aria-label="Instagram do desenvolvedor do site" className="hover:text-m2-green transition-colors duration-300">LEV.B - Marketing 360º</a>
          </p>
          <div className="flex justify-center items-center space-x-6">
            <a 
              href="https://www.instagram.com/m2projecta/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Página da M2 Projecta no Instagram"
              className="text-gray-400 hover:text-m2-green transition-colors duration-300"
            >
              <FaInstagram size={28} />
            </a>
            <a 
              href="https://www.youtube.com/@M2Projecta" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Canal da M2 Projecta no YouTube"
              className="text-gray-400 hover:text-m2-green transition-colors duration-300"
            >
              <FaYoutube size={28} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}