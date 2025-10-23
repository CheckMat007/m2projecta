// src/app/gestor/(admin)/site/inicio/page.tsx
import { Separator } from "@/components/ui/separator";
import { getHomePageData } from './actions';
import { InicioForm } from './_components/InicioForm';
import { TestimonialsManager } from "./_components/TestimonialsManager";
import { FaqManager } from "./_components/FaqManager"; // 1. Importa o novo gerenciador
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default async function InicioPage() {
  const homeData = await getHomePageData();
  const currentVideoLink = `https://www.youtube.com/watch?v=${homeData.youtubeVideoId}`;

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: 'asc' },
  });

  // 2. Busca os itens de FAQ
  const faqItems = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Página Inicial</h1>
        <p className="text-gray-400">Edite os conteúdos dinâmicos da sua página principal.</p>
      </div>

      <Separator className="bg-gray-700" />
      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm">
          <span className="font-semibold">Aviso:</span> As informações serão exibidas no site público. Altere com cuidado.
        </p>
      </div>
      <Card className="bg-black/30 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Seção Hero</CardTitle>
          <p className="text-sm text-gray-400">Gerencie o vídeo principal da sua página inicial.</p>
        </CardHeader>
        <CardContent>
          <InicioForm currentLink={currentVideoLink} />
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-gray-800 text-white">
        <CardHeader>
          <div className="bg-red-500/30 text-white border border-red-700 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm">
          <span className="font-semibold">ATENÇÃO:</span> Esta seção está desativada, mas as informações ainda podem ser adicionadas.
        </p>
      </div>
          <CardTitle className="text-xl font-semibold">Depoimentos de Clientes</CardTitle>
          <p className="text-sm text-gray-400">Adicione, edite e organize os depoimentos que aparecem na página inicial.</p>
        </CardHeader>
        <CardContent>
          <TestimonialsManager testimonials={testimonials} />
        </CardContent>
      </Card>

      {/* 3. SUBSTITUI O PLACEHOLDER PELO NOVO GERENCIADOR */}
      <Card className="bg-black/30 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Perguntas Frequentes (FAQ)</CardTitle>
          <p className="text-sm text-gray-400">Gerencie as perguntas e respostas da seção FAQ da sua página inicial.</p>
        </CardHeader>
        <CardContent>
          <FaqManager faqItems={faqItems} />
        </CardContent>
      </Card>
    </div>
  );
}