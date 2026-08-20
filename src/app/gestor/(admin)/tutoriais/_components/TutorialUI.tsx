// src/app/gestor/(admin)/tutoriais/_components/TutorialUI.tsx
import { CheckCircle2, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionIntro({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>;
}

export function FeatureList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 mb-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed">
          <CheckCircle2 className="h-4 w-4 text-m2-green shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PermissionNote({ permission }: { permission?: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm bg-muted/50 border border-border rounded-md p-3 mb-6">
      <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      {permission ? (
        <span>
          Só aparece no menu, e só funciona, para quem é <strong>Master</strong> ou tem a permissão{' '}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border">{permission}</code> atribuída
          em <em>Gerenciar Equipe</em>.
        </span>
      ) : (
        <span>Disponível para qualquer usuário logado no painel (Master ou Editor), sem permissão específica.</span>
      )}
    </div>
  );
}

export function TipBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 rounded-md p-3 mb-6">
      <Info className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export function WarningBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-md p-3 mb-6">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mt-8 mb-3">{children}</h3>;
}
