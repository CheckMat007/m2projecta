// src/app/gestor/(admin)/equipe/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dados fictícios para a tabela de equipe
const mockTeam = [
  {
    id: '1',
    name: 'Gestor M2 Projecta',
    email: 'gestor@m2projecta.com.br',
    role: 'MASTER',
  },
  {
    id: '2',
    name: 'Piloto/Editor',
    email: 'funcionario1@m2projecta.com.br',
    role: 'EDITOR',
  },
];

export default function EquipePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Equipe</h1>
        <p className="text-gray-400">Adicione novos membros e gerencie suas permissões de acesso.</p>
      </div>

      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm"><span className="font-semibold">Aviso:</span> Os dados exibidos são apenas exemplos para demonstração.</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Membros da Equipe</h2>
        <Link href="/gestor/equipe/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Convidar Membro
          </Button>
        </Link>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="w-[40%]">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeam.map((member) => (
              <TableRow key={member.id} className="border-gray-800">
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-gray-400">{member.email}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${
                    member.role === 'MASTER' ? 'text-m2-green' : 'text-gray-300'
                  }`}>
                    {member.role}
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