// src/app/gestor/(admin)/_components/sidebar-client.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ElementType, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
// Tipos e NavItem (sem alterações)
type IconName = keyof typeof LucideIcons;
interface MenuItem { href?: string; icon: IconName; label: string; subItems?: Omit<MenuItem, 'subItems'>[];}
interface NavItemProps { href: string; icon: ElementType; label: string; isCollapsed: boolean; }
interface SidebarClientProps { user: Session['user']; menuItems: MenuItem[]; children: ReactNode; isCollapsed: boolean; toggleSidebar: () => void; }
const NavItem = ({ href, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/gestor' && pathname.startsWith(href));

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800'} ${isCollapsed ? 'justify-center' : ''}`}>
            <Icon size={20} />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right"><p>{label}</p></TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export const SidebarClient = ({ user, menuItems, children, isCollapsed, toggleSidebar }: SidebarClientProps) => {
  const fullName = user?.name || 'Usuário';

  return (
    // A CORREÇÃO PRINCIPAL: Usamos `fixed top-0 left-0` para tirar a sidebar do fluxo normal do documento.
    // Ela agora "flutua" sobre a página.
    <aside className={`fixed top-0 left-0 bg-black/50 h-screen flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20 p-2' : 'w-64 p-4'}`}>
      
      {/* SEÇÃO DO USUÁRIO E NOTIFICAÇÕES */}
      <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
        <DropdownMenu>
            <DropdownMenuTrigger 
              className={`flex items-center gap-4 min-w-0 p-2 rounded-md hover:bg-gray-800 transition-colors text-left outline-none 
                         ${isCollapsed ? 'justify-center rounded-full h-12 w-12' : 'flex-grow'}`}
            >
                <div className={`w-12 h-12 rounded-full border-2 border-m2-green bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0
                              ${isCollapsed ? 'border-transparent' : ''}`}
                >
                  {user?.image ? <Image src={user.image} alt="Foto de perfil" width={48} height={48} className="object-cover w-full h-full" /> : <LucideIcons.User className="text-gray-400" />}
                </div>
                {!isCollapsed && (
                    <>
                        <div className="min-w-0">
                            <p className="font-bold text-white truncate">{fullName}</p>
                            <p className="text-sm text-gray-400">Ver perfil</p>
                        </div>
                        <LucideIcons.ChevronDown size={16} className="ml-auto text-gray-400" />
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild><Link href="/gestor/perfil"><LucideIcons.UserCog size={16} className="mr-2" />Editar Perfil</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/gestor/login' })} className="text-red-400 focus:bg-red-900/50 focus:text-red-300"><LogoutButton asMenuItem /></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
        <div className={isCollapsed ? 'absolute bottom-24' : ''}>
           {children}
        </div>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item: MenuItem) => {
          const Icon = (LucideIcons[item.icon] || LucideIcons.HelpCircle) as ElementType;
          if (item.subItems && !isCollapsed) {
            return (
              <Collapsible key={item.label} className="space-y-1">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-gray-800">
                  <div className="flex items-center gap-3"><Icon size={20} />{item.label}</div>
                  <LucideIcons.ChevronDown size={16} className="transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 space-y-1">
                  {item.subItems.map(subItem => {
                    const SubIcon = (LucideIcons[subItem.icon] || LucideIcons.HelpCircle) as ElementType;
                    return <NavItem key={subItem.href!} href={subItem.href!} icon={SubIcon} label={subItem.label} isCollapsed={isCollapsed} />
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }
          return <NavItem key={item.href || item.label} href={item.href || '#'} icon={Icon} label={item.label} isCollapsed={isCollapsed} />;
        })}
      </nav>

      {/* RODAPÉ: LOGO, VERSÃO E BOTÃO DE COLAPSAR */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className={`mb-4 text-center ${isCollapsed ? 'hidden' : 'block'}`}>
            <Link href="/" className="inline-block h-auto w-32"><Logo /></Link>
        </div>
        <p className={`text-xs text-center text-gray-500 ${isCollapsed ? 'hidden' : 'block'}`}>
          Versão 0.7.1
        </p>
        <div className="mt-4 flex justify-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {isCollapsed ? <LucideIcons.ChevronsRight size={20} /> : <LucideIcons.ChevronsLeft size={20} />}
            </Button>
        </div>
      </div>
    </aside>
  );
};