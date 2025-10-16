// src/app/gestor/(admin)/projetos/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dados fictícios para a tabela de projetos
const mockProjects = [
  {
    id: '1',
    name: 'Vídeo Institucional Edifício SkyTower',
    client: 'Construtora Alfa',
    status: 'Concluído',
    dueDate: '10/10/2025',
  },
  {
    id: '2',
    name: 'Cobertura Completa do Festival MusicVibe',
    client: 'Agência de Eventos Gama',
    status: 'Em andamento',
    dueDate: '21/10/2025',
  },
  {
    id: '3',
    name: 'Acompanhamento de Obra - Residencial Sol',
    client: 'Construtora Alfa',
    status: 'Agendado',
    dueDate: '30/11/2025',
  },
];

export default function ProjetosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Projetos</h1>
        <p className="text-gray-400">Organize os projetos, associe clientes e acompanhe o status.</p>
      </div>

      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm"><span className="font-semibold">Aviso:</span> Os dados exibidos são apenas exemplos para demonstração.</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projetos Atuais</h2>
        <Link href="/gestor/projetos/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="w-[40%]">Nome do Projeto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Entrega</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => (
              <TableRow key={project.id} className="border-gray-800">
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="text-gray-400">{project.client}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Concluído' ? 'bg-green-900/50 text-green-400' :
                    project.status === 'Em andamento' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{project.dueDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white"><Edit size={16} /></Button>
                    <Button variant="destructive" size="sm" className="bg-red-900/50 border border-red-500/30 hover:bg-red-900/80"><Trash2 size={16} /></Button>
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