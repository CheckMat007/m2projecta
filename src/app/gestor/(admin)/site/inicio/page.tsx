// src/app/gestor/(admin)/site/inicio/page.tsx

import { Separator } from "@/components/ui/separator";
import { getHomePageData } from './actions';
import { InicioForm } from './_components/InicioForm';

// Esta página agora é um Componente de Servidor (async)
export default async function InicioPage() {

  // 1. Busca os dados no servidor antes de renderizar
  const homeData = await getHomePageData();
  
  // 2. Constrói o link completo a partir do ID salvo
  const currentVideoLink = `https://www.youtube.com/watch?v=${homeData.youtubeVideoId}`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Página Inicial</h1>
        <p className="text-gray-400">Edite os conteúdos dinâmicos da sua página principal.</p>
      </div>

      <Separator className="bg-gray-700" />

      {/* 3. Renderiza o formulário (Cliente) passando os dados (Servidor) */}
      <InicioForm currentLink={currentVideoLink} />
    </div>
  );
}