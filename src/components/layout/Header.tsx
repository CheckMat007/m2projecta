// src/components/layout/Header.tsx

'use client';

import { useState } from 'react';
import Logo from '@/components/ui/Logo';

// Props que o componente vai receber. 'activeSection' virá na Parte 2.
type HeaderProps = {
  activeSection: string;
};

export const Header = ({ activeSection }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Array para facilitar a renderização dos links e a verificação do estado ativo
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
        
        {/* NAVEGAÇÃO ATUALIZADA */}
        <nav className="hidden md:flex space-x-16 items-center text-lg">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              // Lógica para aplicar a classe 'active' ou as de hover
              className={`
                relative transition-colors duration-300 group
                ${activeSection === link.href.substring(1) ? 'text-m2-green' : 'hover:text-m2-green'}
              `}
            >
              {link.label}
              {/* Efeito de sublinhado no hover */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </a>
          ))}
        </nav>

        <a href="#" className="hidden md:inline-block bg-m2-green text-black font-bold py-2 px-4 rounded-lg hover:bg-white transition-colors duration-300">
          Área do Cliente
        </a>
        <button id="mobile-menu-button" className="md:hidden text-white focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path></svg>
        </button>
      </div>

      {/* MENU MOBILE (pode ser atualizado depois com a mesma lógica) */}
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
  );
};