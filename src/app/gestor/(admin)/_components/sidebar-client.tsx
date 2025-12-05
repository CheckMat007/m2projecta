// src/app/gestor/(admin)/_components/sidebar-client.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, type ElementType, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

// Tipos e NavItem
type IconName = keyof typeof LucideIcons;
interface MenuItem { href?: string; icon: IconName; label: string; subItems?: Omit<MenuItem, 'subItems'>[];}
interface NavItemProps { href: string; icon: ElementType; label: string; isCollapsed: boolean; }
interface SidebarClientProps { user: Session['user']; menuItems: MenuItem[]; children: ReactNode; isCollapsed: boolean; toggleSidebar: () => void; }

const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/gestor' && pathname.startsWith(href));

  // Se estiver colapsado, envolvemos com Tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} className={`flex items-center justify-center h-10 w-10 mx-auto rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}>
              <Icon size={20} />
              <span className="sr-only">{label}</span> {/* Texto apenas para leitores de tela */}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-800">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Se estiver expandido, renderização normal
  return (
    <Link href={href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`}>
      <Icon size={20} />
      <span className="truncate">{label}</span>
    </Link>
  );
};

export const SidebarClient = ({ user, menuItems, children, isCollapsed, toggleSidebar }: SidebarClientProps) => {
  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(pathname.startsWith('/gestor/site') ? 'Gerenciar Site' : '');

  const handleCollapsedItemClick = (itemLabel: string) => {
    toggleSidebar();
    setOpenMenu(itemLabel);
  };

  return (
    <aside className={`fixed top-0 left-0 bg-black/95 backdrop-blur-sm h-screen flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20 p-2' : 'w-64 p-4'}`}>
      
      {/* SEÇÃO DO USUÁRIO */}
      <div className={`mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <DropdownMenu>
            <DropdownMenuTrigger 
              className={`flex items-center gap-4 min-w-0 hover:bg-gray-800 transition-colors text-left outline-none w-full
                         ${isCollapsed ? 'justify-center rounded-full h-12 w-12' : 'p-2 rounded-md'}`}
            >
                <div className="w-12 h-12 rounded-full border-2 border-m2-green bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.image ? <Image src={user.image} alt="Foto de perfil" width={48} height={48} className="object-cover w-full h-full" /> : <LucideIcons.User className="text-gray-400" />}
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <div className="min-w-0">
                            <p className="font-bold text-white truncate">{firstName}</p>
                            <p className="text-sm text-gray-400 truncate">Ver perfil</p>
                        </div>
                    </div>
                )}
                 {!isCollapsed && <LucideIcons.ChevronDown size={16} className="ml-auto text-gray-400 flex-shrink-0" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side={isCollapsed ? "right" : "bottom"} align="start">
                <DropdownMenuItem asChild><Link href="/gestor/perfil"><LucideIcons.UserCog size={16} className="mr-2" />Editar Perfil</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/gestor/login' })} className="text-red-400 focus:bg-red-900/50 focus:text-red-300"><LogoutButton asMenuItem /></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {menuItems.map((item: MenuItem) => {
          const Icon = (LucideIcons[item.icon] || LucideIcons.HelpCircle) as ElementType;

          // Lógica para itens com submenu quando colapsado
          if (item.subItems && isCollapsed) {
            return (
              <TooltipProvider key={item.label} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleCollapsedItemClick(item.label)}
                      className={`flex items-center justify-center h-10 w-10 mx-auto rounded-md transition-colors hover:bg-gray-800 text-gray-300 hover:text-white`}
                    >
                      <Icon size={20} />
                      <span className="sr-only">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-900 text-white border-gray-800">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          // Lógica para itens com submenu quando expandido
          if (item.subItems && !isCollapsed) {
            return (
              <Collapsible 
                key={item.label} 
                className="space-y-1"
                open={openMenu === item.label}
                onOpenChange={(isOpen) => setOpenMenu(isOpen ? item.label : '')}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-gray-800 text-gray-300 hover:text-white group">
                  <div className="flex items-center gap-3"><Icon size={20} />{item.label}</div>
                  <LucideIcons.ChevronDown size={16} className={`transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''} text-gray-500 group-hover:text-white`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 border-l border-gray-800 ml-4">
                  {item.subItems.map(subItem => {
                    const SubIcon = (LucideIcons[subItem.icon] || LucideIcons.HelpCircle) as ElementType;
                    return <NavItem key={subItem.href!} href={subItem.href!} icon={SubIcon} label={subItem.label} isCollapsed={isCollapsed} />
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }

          // Item normal
          return <NavItem key={item.href || item.label} href={item.href || '#'} icon={Icon} label={item.label} isCollapsed={isCollapsed} />;
        })}
      </nav>

      {/* RODAPÉ E BOTÕES DE AÇÃO */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className={`mb-4 text-center ${isCollapsed ? 'hidden' : 'block'}`}>
            <Link href="/" className="inline-block h-auto w-32"><Logo /></Link>
        </div>
        
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <div className="flex-grow"></div>}

            <div className="flex items-center gap-1">
                {!isCollapsed && (
                    <div className="text-xs text-center text-gray-500 mr-4">
                        Versão 2.0.0
                    </div>
                )}
                
                {/* Sino de notificação (quando expandido) */}
                {!isCollapsed && children}
                
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                    {isCollapsed ? <LucideIcons.ChevronsRight size={20} /> : <LucideIcons.ChevronsLeft size={20} />}
                </Button>
            </div>
        </div>

        {/* Sino de notificação (quando colapsado) */}
        {isCollapsed && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center">
            {children}
          </div>
        )}
      </div>
    </aside>
  );
};