// src/app/gestor/(admin)/site/inicio/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { Separator } from "@/components/ui/separator";
import { getHomePageData } from './actions';
import { InicioForm } from './_components/InicioForm';
import { FaqManager } from "./_components/FaqManager";
import { prisma } from "@/lib/prisma";
import {
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Info, 
  Youtube, 
   
  HelpCircle, 
  LayoutTemplate,
  
} from "lucide-react";

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function InicioPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_site')) {
    redirect('/gestor');
  }

  const homeData = await getHomePageData();
  const currentVideoLink = homeData.youtubeVideoIsVertical
    ? `https://www.youtube.com/shorts/${homeData.youtubeVideoId}`
    : `https://www.youtube.com/watch?v=${homeData.youtubeVideoId}`;



  const faqItems = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            Página Inicial
        </h1>
        <p className="text-muted-foreground mt-1">
            Personalize os conteúdos dinâmicos exibidos na home do seu site.
        </p>
      </div>

      <Separator />

      {/* Aviso Geral */}
      <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Aviso Importante</AlertTitle>
        <AlertDescription className="text-sm opacity-90">
          As informações alteradas aqui são atualizadas em tempo real no site público. Revise antes de salvar.
        </AlertDescription>
      </Alert>

      {/* --- SEÇÃO HERO (VÍDEO) --- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" /> Seção Hero
          </CardTitle>
          <CardDescription>
            Configure o vídeo de destaque que aparece no topo da página inicial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InicioForm currentLink={currentVideoLink} />
        </CardContent>
      </Card>
      

      {/* --- SEÇÃO FAQ --- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Perguntas Frequentes (FAQ)
          </CardTitle>
          <CardDescription>
            Edite as perguntas e respostas para tirar dúvidas rápidas dos visitantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqManager faqItems={faqItems} />
        </CardContent>
      </Card>

    </div>
  );
}