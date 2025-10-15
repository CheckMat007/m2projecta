// src/components/layout/Header.tsx

'use client';

import { useState } from 'react';
import Logo from '@/components/ui/Logo';

type HeaderProps = {
  activeSection: string;
};

export const Header = ({ activeSection }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#portfolio', label: 'Portfólio' },
    { href: '#contato', label: 'Contato' },
  ];

  return (
    <header id="home" className="bg-black/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="inline-block h-auto w-auto">
          <Logo />
        </a>
        
        <nav className="hidden md:flex space-x-16 items-center text-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a 
                key={link.href}
                href={link.href}
                className={`
                  relative transition-colors duration-300 group
                  ${isActive ? 'text-m2-green' : 'hover:text-m2-green'}
                `}
              >
                {link.label}
                {/* LINHA ATUALIZADA PARA REAGIR AO ESTADO 'ACTIVE' E AO 'HOVER' */}
                <span 
                  className={`
                    absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transition-transform duration-300 origin-left
                    ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                  `}
                ></span>
              </a>
            );
          })}
        </nav>

        <a href="/login" className="hidden md:inline-block bg-m2-green text-black font-bold py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
          Área do Cliente
        </a>
        <button id="mobile-menu-button" className="md:hidden text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path></svg>
        </button>
      </div>

      {/* MENU MOBILE */}
      <div id="mobile-menu" className={`md:hidden px-6 pt-2 pb-4 space-y-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
        {navLinks.map((link) => (
           <a 
             key={link.href}
             href={link.href} 
             onClick={handleLinkClick} 
             className={`block transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-m2-green' : 'hover:text-m2-green'}`}
           >
             {link.label}
           </a>
        ))}
        <a href="#" onClick={handleLinkClick} className="block bg-m2-green text-black text-center font-bold mt-4 py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
          Área do Cliente
        </a>
      </div>
    </header>
  );
};