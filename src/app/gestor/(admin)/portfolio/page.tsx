// src/app/gestor/(admin)/portfolio/page.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Info, 
  PlusCircle, 
  Edit, 
  Briefcase, 
  Image as ImageIcon, 
  Star, 
  LayoutTemplate
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // IMPORTANTE: Importação do componente de Imagem
import { prisma } from '@/lib/prisma';
import { DeletePortfolioButton } from './_components/DeletePortfolioButton';
import { FeaturedSwitch } from './_components/FeaturedSwitch';

// Configurações
const MAX_FEATURED_ITEMS = 10;

// --- DATA FETCHING ---
async function getPortfolioData() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      service: true,
    },
  });
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });
  return { items, featuredCount };
}

// --- PÁGINA PRINCIPAL ---
export default async function PortfolioPage() {
  const { items, featuredCount } = await getPortfolioData();

  // Helper para Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED': 
        return <Badge className="bg-m2-green/20 text-green-700 dark:text-green-400 border-transparent hover:bg-m2-green/30">Publicado</Badge>;
      default: 
        return <Badge variant="secondary">Rascunho</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden pb-20">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            Portfólio
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gerencie os projetos exibidos na vitrine do seu site.
          </p>
        </div>
        
        <Link href="/gestor/portfolio/novo">
          <Button className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium shadow-sm">
            <PlusCircle size={18} className="mr-2" />
            Adicionar Item
          </Button>
        </Link>
      </div>

      {/* INFO CARD: LIMITES DE DESTAQUE */}
      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Gerenciamento de Destaques</AlertTitle>
        <AlertDescription className="mt-1 text-sm opacity-90">
          Você tem <strong>{featuredCount}</strong> de <strong>{MAX_FEATURED_ITEMS}</strong> projetos destacados na Home.
          {featuredCount >= MAX_FEATURED_ITEMS && (
            <span className="block mt-1 font-semibold text-red-500">
              Limite atingido. Remova o destaque de um item antes de adicionar outro.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* --- GRID DE CARDS --- */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full overflow-hidden">
              
              {/* CORREÇÃO: Renderização da Imagem de Capa */}
              <div className="relative w-full h-48 bg-muted/40 border-b border-border overflow-hidden">
                {item.coverImage ? (
                    <Image 
                        src={item.coverImage} 
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-xs font-medium">Sem imagem de capa</span>
                    </div>
                )}
                
                {/* Badge de Status Flutuante sobre a imagem */}
                <div className="absolute top-2 right-2">
                    {getStatusBadge(item.status)}
                </div>
              </div>

              <CardHeader className="pt-4 pb-2">
                <div className="space-y-1">
                   <h3 className="font-semibold text-base leading-tight line-clamp-1" title={item.title}>
                      {item.title}
                   </h3>
                   <div className="flex items-center text-xs text-muted-foreground">
                      <Briefcase className="mr-1 h-3 w-3" />
                      <span className="truncate">{item.service?.name || 'Sem Categoria'}</span>
                   </div>
                </div>
              </CardHeader>

              <CardContent className="py-2 flex-grow">
                {/* Switch de Destaque */}
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md border border-border mt-2">
                    <div className="flex items-center gap-2">
                        <Star className={`h-4 w-4 ${item.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-medium">Destaque na Home</span>
                    </div>
                    <FeaturedSwitch
                      item={item}
                      featuredCount={featuredCount}
                      maxFeatured={MAX_FEATURED_ITEMS}
                    />
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="pt-3 pb-3 px-4 flex justify-between bg-muted/20">
                 <Link href={`/gestor/portfolio/editar/${item.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-medium border-dashed hover:border-primary hover:text-primary transition-colors">
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Editar
                    </Button>
                 </Link>
                 
                 <div className="ml-2">
                    <DeletePortfolioButton id={item.id} />
                 </div>
              </CardFooter>

            </Card>
          ))}
        </div>
      ) : (
        // Estado Vazio
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
                <h3 className="font-semibold text-lg">Seu portfólio está vazio</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Adicione seus melhores trabalhos para impressionar seus clientes.
                </p>
            </div>
            <Link href="/gestor/portfolio/novo">
              <Button className="bg-m2-green text-black hover:bg-m2-green/90 mt-2">
                 Adicionar Primeiro Item
              </Button>
            </Link>
        </div>
      )}
    </div>
  );
}