// src/app/gestor/(admin)/site/aparencia/page.tsx
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { AppearanceForm } from "./_components/AppearanceForm"; // Criaremos este a seguir

// Busca os dados no servidor
async function getPageSettings() {
  // Busca a configuração da página 'ABOUT' ou cria se não existir
  let aboutSettings = await prisma.pageSettings.findUnique({
    where: { pageKey: "ABOUT" },
  });

  if (!aboutSettings) {
    aboutSettings = await prisma.pageSettings.create({
      data: {
        pageKey: "ABOUT",
        heroImageUrl: "/assets/portfolio/dutra.JPG", // Imagem padrão
      },
    });
  }
  return { aboutSettings };
}

export default async function AppearancePage() {
  const { aboutSettings } = await getPageSettings();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Aparência do Site</h1>
        <p className="text-gray-400">Edite os elementos visuais das páginas públicas.</p>
      </div>
      <Separator className="bg-gray-700" />
      
      {/* Passa os dados para o formulário cliente */}
      <AppearanceForm aboutSettings={aboutSettings} />
    </div>
  );
}