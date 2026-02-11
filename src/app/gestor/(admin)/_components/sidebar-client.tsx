// src/app/gestor/(admin)/_components/sidebar-client.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ElementType, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';

// --- TIPOS ---
type IconName = keyof typeof LucideIcons;
interface MenuItem { href?: string; icon: IconName; label: string; subItems?: Omit<MenuItem, 'subItems'>[];}
interface SidebarClientProps { user: Session['user']; menuItems: MenuItem[]; children: ReactNode; isCollapsed: boolean; toggleSidebar: () => void; }

// --- COMPONENTES AUXILIARES ---

// 1. Dropdown de Usuário (APENAS DESKTOP)
const DesktopUserDropdown = ({ user, isCollapsed }: { user: Session['user'], isCollapsed: boolean }) => {
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-4 min-w-0 hover:bg-gray-800 transition-colors text-left outline-none w-full ${isCollapsed ? 'justify-center rounded-full h-12 w-12' : 'p-2 rounded-md'}`}>
          <div className="w-12 h-12 rounded-full border-2 border-m2-green bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.image ? <Image src={user.image} alt="Foto de perfil" width={48} height={48} className="object-cover w-full h-full" /> : <LucideIcons.User className="text-gray-400" />}
          </div>
          {!isCollapsed && (
            <>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="font-bold text-white truncate">{firstName}</p>
                <p className="text-sm text-gray-400 truncate">Ver perfil</p>
              </div>
              <LucideIcons.ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            </>
          )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side={isCollapsed ? "right" : "bottom"} align="start">
        <DropdownMenuItem asChild><Link href="/gestor/perfil"><LucideIcons.UserCog size={16} className="mr-2" />Editar Perfil</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/gestor/login' })} className="text-red-400 focus:bg-red-900/50 focus:text-red-300"><LogoutButton asMenuItem /></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 2. NavItem (Item de Navegação Padrão)
const NavItem = ({ href, icon: Icon, label, isCollapsed, onClick }: { href: string; icon: ElementType; label: string; isCollapsed: boolean; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/gestor' && pathname.startsWith(href));
  const baseClasses = `flex items-center transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800 text-gray-300 hover:text-white'}`;
  
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} onClick={onClick} className={`${baseClasses} justify-center h-10 w-10 mx-auto rounded-md`}>
              <Icon size={20} /> <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-800"><p>{label}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={`${baseClasses} gap-3 p-2 rounded-md w-full`}>
      <Icon size={20} /> <span className="truncate">{label}</span>
    </Link>
  );
};

// 3. MenuList (Lista de itens)
const MenuList = ({ menuItems, isCollapsed, openMenuLabel, setOpenMenuLabel, onItemClick }: { menuItems: MenuItem[], isCollapsed: boolean, openMenuLabel: string, setOpenMenuLabel: (l: string) => void, onItemClick?: () => void }) => {
  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = (LucideIcons[item.icon] || LucideIcons.HelpCircle) as ElementType;
        
        if (item.subItems && isCollapsed) {
          return (
             <TooltipProvider key={item.label} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => onItemClick && onItemClick()} className="flex items-center justify-center h-10 w-10 mx-auto rounded-md transition-colors hover:bg-gray-800 text-gray-300 hover:text-white">
                    <Icon size={20} /> <span className="sr-only">{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-800"><p>{item.label}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        if (item.subItems && !isCollapsed) {
          return (
            <Collapsible key={item.label} open={openMenuLabel === item.label} onOpenChange={(isOpen) => setOpenMenuLabel(isOpen ? item.label : '')} className="space-y-1">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-gray-800 text-gray-300 hover:text-white group">
                <div className="flex items-center gap-3"><Icon size={20} />{item.label}</div>
                <LucideIcons.ChevronDown size={16} className={`transition-transform duration-200 ${openMenuLabel === item.label ? 'rotate-180' : ''} text-gray-500 group-hover:text-white`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-1 border-l border-gray-800 ml-4">
                {item.subItems.map(subItem => {
                  const SubIcon = (LucideIcons[subItem.icon] || LucideIcons.HelpCircle) as ElementType;
                  return <NavItem key={subItem.href!} href={subItem.href!} icon={SubIcon} label={subItem.label} isCollapsed={isCollapsed} onClick={onItemClick} />
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return <NavItem key={item.href || item.label} href={item.href || '#'} icon={Icon} label={item.label} isCollapsed={isCollapsed} onClick={onItemClick} />;
      })}
    </nav>
  );
};


// --- COMPONENTE PRINCIPAL ---
export const SidebarClient = ({ user, menuItems, children, isCollapsed, toggleSidebar }: SidebarClientProps) => {
  const pathname = usePathname();
  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  const [openMenu, setOpenMenu] = useState(pathname.startsWith('/gestor/site') ? 'Gerenciar Site' : '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* ========================================
        MOBILE HEADER
        ========================================
      */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menu">
            <Menu className="text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-gray-300">{children}</div>
          <Link href="/gestor/perfil" className="rounded-full w-10 h-10 border-2 border-m2-green overflow-hidden block">
             {user?.image ? (
                <Image src={user.image} alt={firstName} width={40} height={40} className="object-cover w-full h-full" />
             ) : (
                <LucideIcons.User className="w-full h-full p-2 bg-gray-700 text-gray-400" />
             )}
          </Link>
        </div>
      </header>

      {/* ========================================
        MOBILE SIDEBAR (Drawer)
        ========================================
      */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      <aside className={`fixed inset-y-0 left-0 w-[85%] max-w-xs bg-gray-950 border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="w-24"><Logo /></div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="text-gray-400" />
            </Button>
          </div>
          
          <Link href="/gestor/perfil" className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-2xl border border-gray-800 mb-6 hover:bg-gray-900 hover:border-gray-700 transition-all group">
            <div className="w-12 h-12 rounded-full border-2 border-m2-green overflow-hidden flex-shrink-0">
               {user?.image ? <Image src={user.image} alt={firstName} width={48} height={48} className="object-cover w-full h-full" /> : <LucideIcons.User className="w-full h-full p-2 bg-gray-700 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
               <p className="font-bold text-white truncate text-base">{firstName}</p>
               <div className="flex items-center text-xs text-m2-green group-hover:underline">
                  Editar perfil <ChevronRight size={12} className="ml-1" />
               </div>
            </div>
          </Link>
          
          <div className="flex-1 overflow-y-auto">
             <MenuList 
               menuItems={menuItems} 
               isCollapsed={false} 
               openMenuLabel={openMenu} 
               setOpenMenuLabel={setOpenMenu}
             />
          </div>

          <div className="mt-auto pt-4 border-t border-gray-800">
             <button 
                onClick={() => signOut({ callbackUrl: '/gestor/login' })} 
                className="w-full flex items-center gap-3 p-3 rounded-md text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors mb-2"
             >
                <LogOut size={20} />
                <span className="font-medium">Sair da conta</span>
             </button>
             <div className="text-center text-xs text-gray-600 pb-2">Versão 2.1.0</div>
          </div>
        </div>
      </aside>

      {/* ========================================
        DESKTOP SIDEBAR
        ========================================
      */}
      <aside className={`hidden md:flex fixed top-0 left-0 bg-black/95 backdrop-blur-sm h-screen flex-col border-r border-gray-800 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20 p-2' : 'w-64 p-4'}`}>
        <div className={`mb-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
           <DesktopUserDropdown user={user} isCollapsed={isCollapsed} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <MenuList 
             menuItems={menuItems} 
             isCollapsed={isCollapsed} 
             openMenuLabel={openMenu} 
             setOpenMenuLabel={(label) => {
                if (isCollapsed) toggleSidebar();
                setOpenMenu(label);
             }} 
          />
        </div>

        {/* RODAPÉ DESKTOP CENTRALIZADO */}
        <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col items-center w-full">
          {/* Logo (Apenas quando expandido) */}
          {!isCollapsed && (
            <div className="mb-4 text-center">
              <Link href="/" className="inline-block h-auto w-32"><Logo /></Link>
            </div>
          )}
          
          {/* Grupo de Ações: Sino e Botão Toggle */}
          <div className={`flex items-center justify-center ${isCollapsed ? 'flex-col gap-4 py-2' : 'flex-row gap-4'}`}>
             {/* Sino (Children) */}
             <div className="flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                {children}
             </div>

             {/* Botão de Recolher */}
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                {isCollapsed ? <LucideIcons.ChevronsRight size={20} /> : <LucideIcons.ChevronsLeft size={20} />}
             </Button>
          </div>

          {/* Versão (Abaixo das ações) */}
          {!isCollapsed && (
             <div className="text-xs text-center text-gray-500 mt-4 pb-2">
               v2.1.0
             </div>
          )}
        </div>
      </aside>
    </>
  );
};