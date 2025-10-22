// src/app/gestor/(admin)/portfolio/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Info, PlusCircle, Edit } from "lucide-react";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import { DeletePortfolioButton } from './_components/DeletePortfolioButton';
import { FeaturedSwitch } from './_components/FeaturedSwitch'; // 1. Importa o novo componente

const MAX_FEATURED_ITEMS = 10;

// 2. A função agora busca os itens E a contagem de destaques
async function getPortfolioData() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });
  return { items, featuredCount };
}

export default async function PortfolioPage() {
  const { items, featuredCount } = await getPortfolioData();

  return (
    <div className="space-y-8">
      {/* Cabeçalho e Botão de Ação */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Portfólio</h1>
          <p className="text-gray-400">Adicione, edite e remova os projetos que aparecem no site principal.</p>
        </div>
        <Link href="/gestor/portfolio/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Adicionar Novo Item
          </Button>
        </Link>
      </div>

      {/* 3. AVISO ATUALIZADO com a contagem de destaques */}
      <div className="bg-blue-900/30 text-blue-300 border border-blue-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm">
          <span className="font-semibold">Regra de Destaques:</span> Você pode destacar no máximo **{MAX_FEATURED_ITEMS}** projetos na página inicial.
          Atualmente, você tem **{featuredCount}** item(ns) em destaque.
        </p>
      </div>
      <div className="bg-blue-900/30 text-blue-300 border border-blue-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm">
          <span className="font-semibold">Regra de Destaques:</span> Você deve destacar ao menos 5 projetos para o slide da Homepage funcionar corretamente.
        </p>
      </div>

      {/* Tabela de Itens do Portfólio */}
      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900/50">
              <TableHead className="w-[40%]">Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Se não houver itens, exibe uma mensagem */}
            {items.length === 0 && (
              <TableRow className="border-gray-800">
                <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                  Nenhum item de portfólio cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {/* Lista os itens do banco de dados */}
            {items.map((item) => (
              <TableRow key={item.id} className="border-gray-800 hover:bg-gray-900/50">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-gray-400">{item.category}</TableCell>
                <TableCell>
                  {/* 4. SWITCH INTERATIVO SUBSTITUI O ÍCONE */}
                  <FeaturedSwitch
                    item={item}
                    featuredCount={featuredCount}
                    maxFeatured={MAX_FEATURED_ITEMS}
                  />
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'PUBLISHED' ? 'default' : 'outline'}
                    className={item.status === 'PUBLISHED' 
                      ? 'bg-green-900/50 text-green-400 border-green-700' 
                      : 'bg-yellow-400 text-white border-yellow-600'}
                  >
                    {item.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/gestor/portfolio/editar/${item.id}`}>
                      <Button variant="outline" size="icon" className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <DeletePortfolioButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}