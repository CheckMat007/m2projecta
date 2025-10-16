// src/app/gestor/(admin)/_components/sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
// 1. IMPORTE O NOVO ÍCONE AQUI
import { User, Briefcase, Users, LayoutDashboard, FileText, UserCog } from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  // Usa startsWith para que sub-rotas (ex: /gestor/portfolio/novo) ainda destaquem o link principal
  const isActive = pathname.startsWith(href);

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-m2-green text-black' : 'hover:bg-gray-800'}`}
    >
      <Icon size={20} /> {label}
    </Link>
  );
};

export const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-black/50 h-screen flex flex-col p-4 border-r border-gray-800 sticky top-0">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block h-auto w-40">
          <Logo />
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Foto de perfil" 
                width={48} 
                height={48} 
                className="object-cover w-full h-full" 
              />
            ) : (
              <User className="text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-bold text-white truncate">{session?.user?.name || 'Usuário'}</p>
            <Link href="/gestor/perfil" className="text-sm text-gray-400 hover:text-m2-green">
              Editar perfil
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem href="/gestor" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/gestor/clientes" icon={Users} label="Gerenciar Clientes" />
        <NavItem href="/gestor/projetos" icon={Briefcase} label="Gerenciar Projetos" />
        <NavItem href="/gestor/portfolio" icon={LayoutDashboard} label="Gerenciar Portfólio" />
        <NavItem href="/gestor/contratos" icon={FileText} label="Gerenciar Contratos" />
        
        {/* 2. ADICIONE O NOVO LINK COM CONDIÇÃO DE "MASTER" */}
        {session?.user?.role === 'MASTER' && (
          <NavItem href="/gestor/equipe" icon={UserCog} label="Gerenciar Equipe" />
        )}
      </nav>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
};