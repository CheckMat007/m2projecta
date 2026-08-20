// src/app/gestor/(admin)/tutoriais/_components/TutorialsClientPage.tsx
'use client';

import { useState, useMemo, useRef } from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tutorialGroups } from '../_data';
import type { TutorialSection } from '../_data/types';

type UserPermissions = { role: string; permissionNames: string[] };

export function TutorialsClientPage({ userPermissions }: { userPermissions: UserPermissions }) {
  const allSections = useMemo(() => tutorialGroups.flatMap((g) => g.sections), []);
  const [activeId, setActiveId] = useState(allSections[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeSection: TutorialSection = allSections.find((s) => s.id === activeId) || allSections[0];

  const hasAccess = (permission?: string) => {
    if (!permission) return true;
    return userPermissions.role === 'MASTER' || userPermissions.permissionNames.includes(permission);
  };

  const selectSection = (id: string) => {
    setActiveId(id);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-m2-green/15 flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5 text-m2-green" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tutoriais</h1>
          <p className="text-sm text-muted-foreground">Um guia de tudo que dá para fazer em cada área do painel.</p>
        </div>
      </div>

      {/* SELETOR MOBILE */}
      <div className="md:hidden">
        <Select value={activeId} onValueChange={selectSection}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tutorialGroups.map((group) => (
              <div key={group.id}>
                <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{group.label}</div>
                {group.sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>{section.label}</SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
        {/* NAV DESKTOP */}
        <nav className="hidden md:block sticky top-6 space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          {tutorialGroups.map((group) => (
            <div key={group.id}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                {group.label}
              </h2>
              <div className="space-y-0.5">
                {group.sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = section.id === activeId;
                  const allowed = hasAccess(section.permission);
                  return (
                    <button
                      key={section.id}
                      onClick={() => selectSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-left transition-colors ${
                        isActive
                          ? 'bg-m2-green text-black font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate flex-1">{section.label}</span>
                      {!allowed && !isActive && (
                        <ShieldCheck size={12} className="text-muted-foreground shrink-0" aria-label="Fora do seu acesso atual" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* CONTEÚDO */}
        <div ref={contentRef} className="min-w-0 bg-card border border-border rounded-lg p-5 md:p-8">
          {!hasAccess(activeSection.permission) && (
            <div className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-md px-3 py-2 mb-5">
              <ShieldCheck size={14} />
              Você está vendo esta explicação, mas ainda não tem acesso a esta área no seu usuário.
            </div>
          )}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <activeSection.icon className="h-5 w-5 text-m2-green" />
            {activeSection.label}
          </h2>
          {activeSection.content}
        </div>
      </div>
    </div>
  );
}
