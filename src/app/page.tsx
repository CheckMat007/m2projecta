// src/app/page.tsx
'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaInstagram, FaCameraRetro, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PortfolioSlider } from '@/components/PortfolioSlider';
import InputMask from 'react-input-mask';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const observer = useRef<IntersectionObserver | null>(null);
  const [messageLength, setMessageLength] = useState(0);

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting)?.target.id;
      if (visibleSection) {
        setActiveSection(visibleSection);
      }
    }, { 
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0 
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.current?.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.current?.unobserve(section);
      });
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus({ submitted: true, success: true, message: 'Obrigado pelo contato! Sua mensagem foi enviada com sucesso.' });
        form.reset(); 
        setMessageLength(0);
      } else {
        const responseData = await response.json();
        if (responseData.errors) {
            // CORREÇÃO 1: Trocamos 'any' por um tipo mais específico
            setFormStatus({ submitted: true, success: false, message: responseData.errors.map((error: { message: string }) => error.message).join(', ') });
        } else {
            setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro ao enviar o formulário. Tente novamente.' });
        }
      }
    } catch (error) {
      // CORREÇÃO 2: Usamos a variável 'error' no console.log
      console.error("Erro de rede ao enviar formulário:", error);
      setFormStatus({ submitted: true, success: false, message: 'Ocorreu um erro de rede. Verifique sua conexão e tente novamente.' });
    }
  };

  return (
    <main>
      <Header activeSection={activeSection} />

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

      <section id="sobre" className="py-20 bg-black">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image src="/assets/equipe-m2-projecta.png" alt="Equipe da M2 Projecta com drone" width={600} height={400} className="rounded-lg shadow-lg w-full h-auto" />
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
              Todos nossos voos são regulamentados de acordo com a legislação em vigor, seguindo as normas estabelecidas pelo Departamento de Controle do Espaço Aereo (DECEA), como emissão do plano de voo e autorização de decolagem.
            </p>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Nossos <span className="text-m2-green">Serviços</span></h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Soluções completas em filmagem aérea para diversas necessidades.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-m2-dark p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Construção e Mercado Imobiliário</h3>
              <p className="text-gray-400">Acompanhamento de obras, inspeções técnicas e vídeos para marketing imobiliário.</p>
            </div>
            <div className="bg-m2-dark p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Vídeos Corporativos</h3>
              <p className="text-gray-400">Produção de vídeos institucionais com imagens aéreas impactantes.</p>
            </div>
            <div className="bg-m2-dark p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-m2-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cobertura de Eventos</h3>
              <p className="text-gray-400">Registros aéreos de shows, casamentos, eventos esportivos e mais.</p>
            </div>
            <div className="bg-m2-dark p-8 rounded-lg text-center border border-gray-800 hover:border-m2-green hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <FaCameraRetro className="w-12 h-12 text-m2-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Turismo e Hotelaria</h3>
              <p className="text-gray-400">Criação de conteúdo aéreo para hotéis, pousadas e pontos turísticos.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Nosso <span className="text-m2-green">Portfólio</span></h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Veja alguns dos projetos incríveis que já realizamos.</p>
          </div>
          <PortfolioSlider />
        </div>
      </section>

      <section id="contato" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="bg-m2-dark rounded-lg shadow-lg p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
            
            <div className="text-center md:text-left flex flex-col h-full">
              <div>
                <h2 className="text-3xl font-bold uppercase">Fale <span className="text-m2-green">Conosco</span></h2>
                <p className="text-gray-400 mt-4 max-w-md">
                  Pronto para iniciar seu projeto? Preencha o formulário ao lado e vamos transformar sua ideia em realidade. Nossa equipe entrará em contato o mais breve possível.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-gray-400 mb-4">
                  Ou se preferir, entre em contato através dos seguintes canais:
                </p>
                <div className="space-y-4">
                  <a href="mailto:contato@m2projecta.com.br" className="flex items-center group">
                    <FaEnvelope className="text-m2-green mr-3 h-5 w-5" />
                    <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                      contato@m2projecta.com.br
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
                  </a>
                  <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                    <FaWhatsapp className="text-m2-green mr-3 h-5 w-5" />
                    <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                      WhatsApp (12) 99131-6774
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
                  </a>
                  <a href="https://www.instagram.com/m2projecta/" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                    <FaInstagram className="text-m2-green mr-3 h-5 w-5" />
                    <span className="relative text-gray-300 group-hover:text-m2-green transition-colors">
                      @m2projecta
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                 <h3 className="font-bold text-lg text-white mb-4 uppercase tracking-wider">Área de Atuação</h3>
                 <div className="flex flex-col items-center justify-center md:items-start">
                    <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="text-m2-green mr-3 h-5 w-5 flex-shrink-0" />
                        <p className="text-gray-300">Taubaté - SP e Região (Vale do Paraíba)</p>
                    </div>
                    <div className="w-full max-w-sm md:max-w-md mt-4 px-4 sm:px-0">
                        <Image
                            src="/assets/svg/mapa-sp-valeparaiba.png"
                            alt="Mapa do estado de São Paulo com o Vale do Paraíba destacado"
                            width={500}
                            height={400}
                            className="w-full h-auto transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                 </div>
              </div>
            </div>

            <div className="max-w-md mx-auto md:mx-0 w-full">
              <form 
                action="https://formspree.io/f/xjkajkbq"
                method="POST" 
                className="space-y-6"
                onSubmit={handleFormSubmit}
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                  <input type="text" id="name" name="name" placeholder="Seu nome completo" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                  <input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone / WhatsApp</label>
                  <InputMask
                    mask="(99) 99999-9999"
                    id="phone"
                    name="phone"
                    placeholder="(12) 91234-5678"
                    className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Cidade / Região</label>
                  <input type="text" id="city" name="city" placeholder="Ex: Taubaté - SP" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" required />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Serviço</label>
                  <select id="service" name="service" className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green">
                    <option>Selecione um serviço de interesse</option>
                    <option>Construção e Mercado Imobiliário</option>
                    <option>Vídeo Corporativo</option>
                    <option>Cobertura de Evento</option>
                    <option>Turismo e Hotelaria</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensagem</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Conte-nos um pouco sobre o seu projeto..." 
                    maxLength={500}
                    className="block w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-m2-green focus:border-m2-green" 
                    required
                    onChange={(e) => setMessageLength(e.target.value.length)}
                  ></textarea>
                  <p className="text-right text-sm text-gray-400 mt-1">
                    {messageLength} / 500
                  </p>
                </div>
                <div className="text-center pt-2">
                  <button type="submit" className="bg-m2-green text-black font-bold py-3 px-10 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 w-full">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
              {formStatus.submitted && (
                <div className={`mt-4 text-center p-3 rounded-md ${formStatus.success ? 'bg-green-900/50 text-m2-green' : 'bg-red-900/50 text-red-400'}`}>
                  {formStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}