// src/app/gestor/(admin)/_components/sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; // 1. IMPORTAMOS O 'useState'
import { 
  User, 
  Briefcase, 
  Users, 
  LayoutDashboard, 
  FileText, 
  UserCog, 
  Home, 
  BookOpen, 
  Contact, 
  ChevronDown,
  Paintbrush 
} from 'lucide-react';
import { LogoutButton } from './logout-button';
import Logo from '@/components/ui/Logo';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

// Componente NavItem (sem alterações)
const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
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
  const pathname = usePathname();

  const isSiteMenuActive = pathname.startsWith('/gestor/site');
  
  // 2. CRIAMOS UM ESTADO PARA CONTROLAR O CLIQUE
  // Ele já começa aberto se a rota estiver ativa
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(isSiteMenuActive);

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
      
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <NavItem href="/gestor" icon={LayoutDashboard} label="Dashboard" />

        {/* 3. O COMPONENTE COLAPSÁVEL FOI ATUALIZADO */}
        <Collapsible 
          open={isSiteMenuOpen} // Agora usa o estado de clique
          onOpenChange={setIsSiteMenuOpen} // Atualiza o estado no clique
          className="space-y-1"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-gray-800">
            <div className="flex items-center gap-3">
              <Home size={20} />
              Gerenciar Site
            </div>
            {/* O ícone da seta agora é controlado pelo estado 'isSiteMenuOpen' */}
            <ChevronDown size={16} className={`transition-transform ${isSiteMenuOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1">
            <NavItem href="/gestor/site/inicio" icon={Home} label="Início" />
            <NavItem href="/gestor/site/sobre" icon={BookOpen} label="Sobre Nós" />
            <NavItem href="/gestor/site/servicos" icon={Briefcase} label="Serviços" />
            <NavItem href="/gestor/site/contato" icon={Contact} label="Contato" />
            <NavItem href="/gestor/site/aparencia" icon={Paintbrush} label="Aparência" />
          </CollapsibleContent>
        </Collapsible>
        
        <NavItem href="/gestor/clientes" icon={Users} label="Gerenciar Clientes" />
        <NavItem href="/gestor/projetos" icon={Briefcase} label="Gerenciar Projetos" />
        <NavItem href="/gestor/portfolio" icon={LayoutDashboard} label="Gerenciar Portfólio" />
        <NavItem href="/gestor/contratos" icon={FileText} label="Gerenciar Contratos" />
        
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