// src/app/gestor/(admin)/contratos/page.tsx

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dados fictícios para a tabela de contratos
const mockContracts = [
  {
    id: 'M2-2025-015',
    client: 'Construtora Alfa',
    value: 'R$ 3.500,00',
    status: 'Pago',
  },
  {
    id: 'M2-2025-016',
    client: 'Agência de Eventos Gama',
    value: 'R$ 5.000,00',
    status: 'Pendente',
  },
  {
    id: 'M2-2025-017',
    client: 'Imobiliária Beta',
    value: 'R$ 2.800,00',
    status: 'Vencido',
  },
];

export default function ContratosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Contratos</h1>
        <p className="text-gray-400">Crie e acompanhe o status dos contratos e pagamentos.</p>
      </div>

      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm"><span className="font-semibold">Aviso:</span> Os dados exibidos são apenas exemplos para demonstração.</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contratos Emitidos</h2>
        <Link href="/gestor/contratos/novo">
          <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
            <PlusCircle size={18} className="mr-2" />
            Novo Contrato
          </Button>
        </Link>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>Nº Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContracts.map((contract) => (
              <TableRow key={contract.id} className="border-gray-800">
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell className="text-gray-400">{contract.client}</TableCell>
                <TableCell className="text-gray-400">{contract.value}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contract.status === 'Pago' ? 'bg-green-900/50 text-green-400' :
                    contract.status === 'Pendente' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {contract.status}
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