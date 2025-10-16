// src/app/gestor/(admin)/clientes/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dados fictícios para a tabela de clientes
const mockClients = [
  {
    id: '1',
    name: 'Construtora Alfa',
    email: 'contato@alfa.com',
    phone: '(12) 99123-4567',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Imobiliária Beta',
    email: 'diretoria@betaimoveis.com',
    phone: '(12) 99234-5678',
    status: 'Ativo',
  },
  {
    id: '3',
    name: 'Agência de Eventos Gama',
    email: 'eventos@gama.com',
    phone: '(12) 99345-6789',
    status: 'Inativo',
  },
  {
    id: '4',
    name: 'Hotelaria Vale do Sol',
    email: 'reservas@valedosol.com',
    phone: '(12) 99456-7890',
    status: 'Potencial',
  },
];

export default function ClientesPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho e Aviso */}
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <p className="text-gray-400">Adicione, edite e visualize os clientes da sua empresa.</p>
      </div>

      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm"><span className="font-semibold">Aviso:</span> Os dados exibidos são apenas exemplos para demonstração.</p>
      </div>

      {/* Ações e Título da Tabela */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clientes Cadastrados</h2>
        <Link href="/gestor/clientes/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Cadastrar Cliente
          </Button>
        </Link>
      </div>

      {/* Tabela de Clientes */}
      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="w-[30%]">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id} className="border-gray-800">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-gray-400">{client.email}</TableCell>
                <TableCell className="text-gray-400">{client.phone}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.status === 'Ativo' ? 'bg-green-900/50 text-green-400' : 
                    client.status === 'Potencial' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {client.status}
                  </span>
                </TableCell>
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