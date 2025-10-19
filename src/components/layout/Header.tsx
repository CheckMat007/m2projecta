// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { Menu, X } from 'lucide-react'; // Importa os ícones de Menu e Fechar

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/portfolio', label: 'Portfólio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="inline-block h-12 w-auto">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex space-x-8 items-center text-base">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a key={link.href} href={link.href} className={`relative transition-colors duration-300 group ${isActive ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}>
                {link.label}
                <span className={`absolute bottom-[-5px] left-0 w-full h-0.5 bg-m2-green transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </a>
            );
          })}
        </nav>

        <a href="/area-do-cliente" className="hidden md:inline-block bg-m2-green text-black font-bold py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
          Área do Cliente
        </a>
        
        {/* BOTÃO DO MENU MOBILE CORRIGIDO */}
        <button 
          aria-label="Abrir menu"
          className="md:hidden text-white focus:outline-none z-50" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE ATUALIZADO */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {navLinks.map(link => (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar
            className={`text-2xl font-bold transition-colors ${pathname === link.href ? 'text-m2-green' : 'text-white hover:text-m2-green'}`}
          >
            {link.label}
          </Link>
        ))}
        <a href="/area-do-cliente" className="mt-8 bg-m2-green text-black font-bold py-3 px-6 rounded-lg text-lg hover:bg-white transition-colors">
          Área do Cliente
        </a>
      </div>
    </header>
  );
};