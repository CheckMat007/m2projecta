// src/app/gestor/(admin)/site/sobre/page.tsx

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AboutContentForm } from "./_components/AboutContentForm";

// Função para buscar os dados do conteúdo principal
async function getAboutContent() {
  // Busca o conteúdo principal (título, texto, imagem)
  let mainContent = await prisma.aboutPageContent.findFirst();

  // Se for a primeira vez e não existir, cria uma entrada padrão
  if (!mainContent) {
    mainContent = await prisma.aboutPageContent.create({
      data: {
        title: "De uma paixão a uma profissão",
        mainText: "A M2 Projecta nasceu da união entre a paixão por tecnologia e a arte da narrativa visual...",
        mainImageUrl: "/assets/about/historia.jpg",
      },
    });
  }
  return mainContent;
}

export default async function SobreSitePage() {
  const mainContent = await getAboutContent();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      

      {/* Card para editar o Conteúdo Principal da página Sobre */}
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle>Seção NOSSA HISTÓRIA</CardTitle>
          <CardDescription>Altere o título, texto e imagem desta seção.</CardDescription>
        </CardHeader>
        <CardContent>
          <AboutContentForm content={mainContent} />
        </CardContent>
      </Card>
      
      {/* Aqui podemos adicionar o card para a Hero Image e outros no futuro */}
    </div>
  );
}