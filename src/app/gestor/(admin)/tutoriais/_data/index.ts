// src/app/gestor/(admin)/tutoriais/_data/index.ts
import { dashboardSection } from './dashboardSection';
import { notificacoesSection } from './notificacoesSection';
import { blogSections } from './blogSections';
import { siteSections } from './siteSections';
import { clientesSection } from './clientesSection';
import { contratosSection } from './contratosSection';
import { projetosSection } from './projetosSection';
import { portfolioSection } from './portfolioSection';
import { equipeSection } from './equipeSection';
import { perfilSection } from './perfilSection';
import type { TutorialGroup } from './types';

// Mesma ordem/agrupamento do menu real em gestor/(admin)/layout.tsx
export const tutorialGroups: TutorialGroup[] = [
  { id: 'visao-geral', label: 'Visão Geral', sections: [dashboardSection] },
  { id: 'comunicacao', label: 'Comunicação', sections: [notificacoesSection] },
  { id: 'blog', label: 'Blog', sections: blogSections },
  { id: 'site', label: 'Gerenciar Site', sections: siteSections },
  { id: 'clientes', label: 'Clientes', sections: [clientesSection] },
  { id: 'contratos', label: 'Contratos', sections: [contratosSection] },
  { id: 'projetos', label: 'Projetos', sections: [projetosSection] },
  { id: 'portfolio', label: 'Portfólio', sections: [portfolioSection] },
  { id: 'equipe', label: 'Equipe', sections: [equipeSection] },
  { id: 'minha-conta', label: 'Minha Conta', sections: [perfilSection] },
];
