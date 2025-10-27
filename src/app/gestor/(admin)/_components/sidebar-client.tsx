// src/app/gestor/(admin)/_components/sidebar-client.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, type ElementType } from 'react';
import * as LucideIcons from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Session } from 'next-auth';

// Tipos (sem alterações)
type IconName = keyof typeof LucideIcons;
interface MenuItem {
  href?: string;
  icon: IconName;
  label: string;
  subItems?: Omit<MenuItem, 'subItems'>[];
}
interface NavItemProps {
  href: string;
  icon: ElementType;
  label: string;
}
interface SidebarClientProps {
  user: Session['user'];
  menuItems: MenuItem[];
}

const NavItem = ({ href, icon: Icon, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/gestor' && pathname.startsWith(href));
  return (
    <Link href={href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800'}`}>
      <Icon size={20} /> {label}
    </Link>
  );
};

export const SidebarClient = ({ user, menuItems }: SidebarClientProps) => {
  const pathname = usePathname();
  const isSiteMenuActive = pathname.startsWith('/gestor/site');
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(isSiteMenuActive);

  return (
    <aside className="w-64 bg-black/50 h-screen flex flex-col p-4 border-r border-gray-800 sticky top-0">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block h-auto w-40"><Logo /></Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-m2-green bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.image ? <Image src={user.image} alt="Foto de perfil" width={48} height={48} className="object-cover w-full h-full" /> : <LucideIcons.User className="text-gray-400" />}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{user?.name || 'Usuário'}</p>
            <Link href="/gestor/perfil" className="text-sm text-gray-400 hover:text-m2-green">Editar perfil</Link>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item: MenuItem) => {
          // APLICAR A CORREÇÃO AQUI
          const Icon = (LucideIcons[item.icon] || LucideIcons.HelpCircle) as ElementType;
          
          if (item.subItems) {
            return (
              <Collapsible key={item.label} open={isSiteMenuOpen} onOpenChange={setIsSiteMenuOpen} className="space-y-1">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-gray-800">
                  <div className="flex items-center gap-3"><Icon size={20} /> {item.label}</div>
                  <LucideIcons.ChevronDown size={16} className={`transition-transform ${isSiteMenuOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 space-y-1">
                  {item.subItems.map(subItem => {
                    // E APLICAR A CORREÇÃO AQUI TAMBÉM
                    const SubIcon = (LucideIcons[subItem.icon] || LucideIcons.HelpCircle) as ElementType;
                    return <NavItem key={subItem.href!} href={subItem.href!} icon={SubIcon} label={subItem.label} />
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          }
          return <NavItem key={item.href!} href={item.href!} icon={Icon} label={item.label} />;
        })}
      </nav>
      <div className="mt-auto">
        <LogoutButton />
        <p className="text-sm text-center text-gray-400 mt-2">Versão 0.6.0</p>
      </div>
    </aside>
  );
};