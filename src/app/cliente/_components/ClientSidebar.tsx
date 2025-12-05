// src/app/cliente/_components/ClientSidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { ClientLogoutButton } from './ClientLogoutButton';
import type { ReactNode } from 'react';

// Tipo compatível com o que passamos no LayoutClient
type UserDisplay = {
    name: string;
    email?: string | null;
    image?: string | null;
};

interface ClientSidebarProps {
  user: UserDisplay;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  children: ReactNode;
}

export function ClientSidebar({ user, isCollapsed, toggleSidebar, children }: ClientSidebarProps) {
  const pathname = usePathname();
  const displayName = user.name; 

  const menuItems = [
    { href: "/cliente", icon: LucideIcons.LayoutDashboard, label: "Resumo" },
    { href: "/cliente/projetos", icon: LucideIcons.Briefcase, label: "Meus Projetos" },
    { href: "/cliente/perfil", icon: LucideIcons.User, label: "Meu Perfil" },
    
    // Links Institucionais (Com a flag 'external')
    { 
      href: "/politica-de-privacidade", 
      icon: LucideIcons.Shield, 
      label: "Política de Privacidade", 
      external: true // Abre em nova janela
    },
    { 
      href: "/termos-e-condicoes", // Atualizado conforme seu pedido
      icon: LucideIcons.FileText, 
      label: "Termos de Uso", 
      external: true // Abre em nova janela
    }, 
  ];

  return (
    <aside className={`fixed top-0 left-0 bg-black/50 h-screen flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20 p-2' : 'w-64 p-4'}`}>
      
      {/* SEÇÃO DO USUÁRIO */}
      <div className={`mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Link 
            href="/cliente/perfil"
            className={`flex items-center gap-4 min-w-0 p-2 rounded-md hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-800 ${isCollapsed ? 'justify-center rounded-full h-12 w-12' : ''}`}
            title="Ir para meu perfil"
        >
            <div className="w-10 h-10 rounded-full border-2 border-m2-green bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.image ? (
                    <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                    <LucideIcons.Building2 className="text-gray-400" size={20} />
                )}
            </div>
            {!isCollapsed && (
                <div className="min-w-0 overflow-hidden">
                    <p className="font-bold text-white truncate text-sm">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">Ver perfil</p>
                </div>
            )}
        </Link>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          // Define as props de alvo se for externo
        
          const targetProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
          
          if (isCollapsed) {
            return (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                        href={item.href} 
                        {...targetProps}
                        className={`flex items-center justify-center h-10 w-10 mx-auto rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
                    >
                      <item.icon size={20} />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right"><p>{item.label}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <Link 
                key={item.href} 
                href={item.href} 
                {...targetProps}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* RODAPÉ E AÇÕES (CENTRALIZADOS) */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className={`mb-4 text-center ${isCollapsed ? 'hidden' : 'block'}`}>
            <Link href="/" className="inline-block h-auto w-24"><Logo /></Link>
        </div>
        
        <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col-reverse justify-center' : 'justify-center'}`}>
            
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-gray-400 hover:text-white"
                title={isCollapsed ? "Expandir" : "Recolher"}
            >
                {isCollapsed ? <LucideIcons.ChevronsRight size={20} /> : <LucideIcons.ChevronsLeft size={20} />}
            </Button>

            {children}

            <ClientLogoutButton isCollapsed={isCollapsed} />

        </div>
      </div>
    </aside>
  );
}