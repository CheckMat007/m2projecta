// src/app/gestor/(admin)/tutoriais/_data/types.ts
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export type TutorialSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Nome da Permission que libera esta área no painel real (undefined = sempre visível) */
  permission?: string;
  content: ReactNode;
};

export type TutorialGroup = {
  id: string;
  label: string;
  sections: TutorialSection[];
};
