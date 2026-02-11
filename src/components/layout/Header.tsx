// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { Menu, X, ChevronDown } from 'lucide-react';

type ServiceLink = {
  id: string;
  name: string;
  slug: string;
};

type HeaderProps = {
  services?: ServiceLink[];
};

export const Header = ({ services = [] }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços', hasSubmenu: true },
    { href: '/portfolio', label: 'Portfólio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-black/95 backdrop-blur-md shadow-lg py-2 border-b border-white/5' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        <Link 
          href="/" 
          aria-label="Página inicial"
          className="relative h-10 md:h-12 transition-all duration-300 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded"
        >
          <Logo />
        </Link>
        
        {/* NAVEGAÇÃO DESKTOP */}
        <nav aria-label="Navegação Principal" className="hidden md:flex space-x-8 items-center text-base">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.hasSubmenu && pathname.startsWith('/servicos'));
            
            if (link.hasSubmenu) {
              return (
                <div key={link.href} className="relative group">
                  <Link 
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 relative transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 py-4 ${isActive ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}
                  >
                    {link.label}
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
                    <span className={`absolute bottom-[10px] left-0 w-full h-0.5 bg-m2-green transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </Link>

                  {services.length > 0 && (
                    <div className="absolute top-full left-0 w-64 bg-[#111] border border-gray-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <div className="flex flex-col py-2">
                        {services.map((service) => (
                          <Link 
                            key={service.id}
                            href={`/servicos/${service.slug}`}
                            className={`px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:bg-gray-800 hover:bg-gray-800 ${pathname === `/servicos/${service.slug}` ? 'text-m2-green font-bold bg-gray-800/50' : 'text-gray-300 hover:text-white'}`}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link 
                key={link.href} 
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-1 py-4 ${isActive ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}
              >
                {link.label}
                <span className={`absolute bottom-[10px] left-0 w-full h-0.5 bg-m2-green transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/cliente/login" 
            className="bg-m2-green text-black font-bold py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-m2-green focus-visible:ring-offset-black"
          >
            Área do Cliente
          </Link>
        </div>
        
        {/* BOTÃO DO MENU MOBILE (Apenas para abrir) */}
        <button 
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Abrir menu"
          className={`md:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-md p-1 relative transition-opacity ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={28} aria-hidden="true" />
        </button>
      </div>

      {/* --- ESTRUTURA DO MENU MOBILE (SIDE DRAWER) --- */}
      
      {/* 1. Backdrop (Fundo MUITO borrado e escuro) */}
      <div 
        className={`md:hidden fixed inset-0 w-full h-[100dvh] bg-black/70 backdrop-blur-md transition-all duration-300 z-[70] ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Menu Lateral (Com o 'X' dentro e itens subidos) */}
      <div 
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        className={`md:hidden fixed top-0 right-0 w-[75%] max-w-[320px] h-[100dvh] bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-[80] overflow-y-auto
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cabeçalho da Gaveta com o botão de Fechar (X) */}
        <div className="flex justify-end p-6">
          <button 
            aria-label="Fechar menu"
            className="text-white hover:text-m2-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-md p-1 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={28} aria-hidden="true" />
          </button>
        </div>

        {/* Corpo da Gaveta - Padding top reduzido (pt-2 em vez de pt-24) para subir os menus */}
        <div className="flex-1 px-6 pt-2 pb-8 flex flex-col gap-6">
          <nav aria-label="Navegação Mobile" className="flex flex-col gap-4">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.hasSubmenu && pathname.startsWith('/servicos'));

              if (link.hasSubmenu && services.length > 0) {
                return (
                  <div key={link.href} className="flex flex-col">
                    <button 
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`flex items-center justify-between text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-md py-2 ${isActive ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}
                    >
                      {link.label}
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180 text-m2-green' : 'text-gray-400'}`} />
                    </button>
                    
                    <div className={`flex flex-col gap-3 pl-4 border-l-2 border-gray-800 ml-2 mt-2 overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                      <Link 
                        href="/servicos"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-base text-m2-green font-medium"
                      >
                        Ver todos os serviços &rarr;
                      </Link>
                      {services.map(service => (
                        <Link 
                          key={service.id}
                          href={`/servicos/${service.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className={`text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-m2-green rounded ${pathname === `/servicos/${service.slug}` ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-md py-2 ${isActive ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-800">
            <Link 
              href="/cliente/login" 
              onClick={() => setIsMenuOpen(false)}
              className="flex justify-center w-full bg-m2-green text-black font-bold py-3 px-6 rounded-lg text-lg hover:bg-white transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-m2-green focus-visible:ring-offset-[#0a0a0a]"
            >
              Área do Cliente
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};