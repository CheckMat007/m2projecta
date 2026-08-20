// src/app/gestor/(admin)/tutoriais/_components/mockups/MockupFrame.tsx
import * as LucideIcons from 'lucide-react';
import type { ReactNode } from 'react';

// Mesma ordem/ícones do menu real (src/app/gestor/(admin)/layout.tsx), pra dar contexto
// de "onde no painel" cada mockup se encaixa sem precisar reconstruir a sidebar inteira.
const MENU_ICONS = [
  'LayoutDashboard', // Dashboard
  'Bell',            // Notificações
  'BookText',        // Blog
  'Home',            // Gerenciar Site
  'Users',           // Gerenciar Clientes
  'FileText',        // Gerenciar Contratos
  'Briefcase',       // Gerenciar Projetos
  'LayoutDashboard', // Gerenciar Portfólio
  'UserCog',         // Gerenciar Equipe
  'GraduationCap',   // Tutoriais
] as const;

function MiniSidebar({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="hidden sm:flex flex-col items-center gap-2 w-12 shrink-0 py-4 bg-white/95 dark:bg-black/95 border-r border-gray-200 dark:border-gray-800">
      <div className="h-6 w-6 rounded bg-m2-green/70 mb-3" />
      {MENU_ICONS.map((iconName, index) => {
        const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Circle) as LucideIcons.LucideIcon;
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            className={`flex items-center justify-center h-7 w-7 rounded-md ${
              isActive ? 'bg-m2-green text-black' : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            <Icon size={14} />
          </div>
        );
      })}
    </div>
  );
}

// Frame "estilo navegador" (bolinhas + barra de endereço) envolvendo uma reconstrução
// simplificada — mas fiel nas cores/tipografia reais — de uma tela do painel.
export function MockupFrame({
  url,
  activeMenuIndex,
  children,
}: {
  url: string;
  activeMenuIndex: number;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-lg not-prose">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border-b border-border">
        <div className="flex gap-1.5 shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 px-3 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground font-mono truncate">
          {url}
        </div>
      </div>
      <div className="flex bg-gray-50 dark:bg-m2-dark">
        <MiniSidebar activeIndex={activeMenuIndex} />
        <div className="flex-1 min-w-0 p-4 md:p-5 text-gray-900 dark:text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

// Badge de status reutilizado em vários mockups (cores extraídas dos componentes reais)
export function MockBadge({
  children,
  tone = 'muted',
}: {
  children: ReactNode;
  tone?: 'green' | 'blue' | 'amber' | 'purple' | 'red' | 'violet' | 'muted';
}) {
  const tones: Record<string, string> = {
    green: 'bg-m2-green text-black',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    violet: 'bg-violet-600 text-white',
    muted: 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function MockCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none ${className}`}>
      {children}
    </div>
  );
}

export function MockButton({
  children,
  variant = 'primary',
}: {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-m2-green text-black',
    outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-transparent',
    ghost: 'text-gray-600 dark:text-gray-300 bg-transparent',
    destructive: 'bg-red-600 text-white',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
