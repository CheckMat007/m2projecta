// src/app/gestor/(admin)/portfolio/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dados fictícios para a tabela do portfólio
const mockPortfolioItems = [
  {
    id: '1',
    title: 'Edifício SkyTower',
    category: 'Marketing Imobiliário',
    status: 'Publicado',
    createdAt: '15/10/2025',
  },
  {
    id: '2',
    title: 'Festival MusicVibe',
    category: 'Cobertura de Evento',
    status: 'Publicado',
    createdAt: '12/10/2025',
  },
  {
    id: '3',
    title: 'Inspeção Industrial Corp.',
    category: 'Acompanhamento de Obra',
    status: 'Rascunho',
    createdAt: '05/10/2025',
  },
  {
    id: '4',
    title: 'Lançamento Residencial Sol Nascente',
    category: 'Marketing Imobiliário',
    status: 'Publicado',
    createdAt: '01/10/2025',
  },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho e Aviso */}
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Portfólio</h1>
        <p className="text-gray-400">Adicione, edite e remova os projetos que aparecem no site principal.</p>
      </div>

      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm">
          <span className="font-semibold">Aviso:</span> Os dados exibidos nesta página são apenas exemplos para fins de demonstração.
        </p>
      </div>

      {/* Ações e Título da Tabela */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Itens Cadastrados</h2>
        <Link href="/gestor/portfolio/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Adicionar Novo Item
          </Button>
        </Link>
      </div>

      {/* Tabela de Itens do Portfólio */}
      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="w-[40%]">Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPortfolioItems.map((item) => (
              <TableRow key={item.id} className="border-gray-800">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-gray-400">{item.category}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Publicado' 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{item.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" className="bg-red-900/50 border border-red-500/30 hover:bg-red-900/80">
                      <Trash2 size={16} />
                    </Button>
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