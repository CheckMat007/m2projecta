// src/app/gestor/(admin)/contratos/_components/ContractsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { Contract } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { PlusCircle, Edit, FileText, ArrowRight, ChevronsUpDown, Check, Upload, X } from 'lucide-react';
import { upsertContractAction } from '../actions';

type ContractWithClient = Contract & { client: { tradeName: string } };

// Função para formatar moeda APENAS para exibição de valores já salvos (Float -> R$)
const formatExistingValue = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função para a máscara de input (Input do usuário -> R$)
const formatInputCurrency = (value: number | string) => {
  // Remove tudo que não é dígito
  const digits = value.toString().replace(/[^0-9]/g, '');
  // Divide por 100 para tratar os últimos 2 dígitos como centavos
  const number = Number(digits) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

// Função para limpar a moeda para envio (R$ 1.000,00 -> 1000.00)
const parseCurrency = (value: string) => {
  return Number(value.replace(/[^0-9]/g, '')) / 100;
};

const truncateFileName = (name: string, maxLength: number = 25) => {
  if (name.length <= maxLength) return name;
  const start = name.slice(0, maxLength - 10);
  const end = name.slice(-7);
  return `${start}...${end}`;
};

function ContractForm({ contract, clients, preSelectedId, onFormSubmit, onSuccess }: { 
  contract?: ContractWithClient, 
  clients: {id: string, tradeName: string}[],
  preSelectedId?: string,
  onFormSubmit: () => void,
  onSuccess: () => void
}) {
  const isEditing = !!contract;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(contract?.clientId || preSelectedId || '');
  const [openCombobox, setOpenCombobox] = useState(false);
  
  // --- CORREÇÃO AQUI ---
  // Se existe contrato, usamos formatExistingValue (sem dividir por 100).
  // Se é novo, começa zerado.
  const [valueDisplay, setValueDisplay] = useState(
    contract ? formatExistingValue(contract.value) : 'R$ 0,00'
  );
  
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ao digitar, usamos a lógica de máscara (que divide por 100)
    setValueDisplay(formatInputCurrency(e.target.value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    
    formData.set('clientId', selectedClientId);
    
    // Limpa o valor visual para número float antes de enviar
    const rawValue = parseCurrency(valueDisplay);
    formData.set('value', rawValue.toString());

    let fileUrl = contract?.fileUrl || '';
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload");
        const newBlob = await uploadResponse.json();
        fileUrl = newBlob.url;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao enviar arquivo.");
        setIsLoading(false);
        return;
      }
    }
    formData.set('fileUrl', fileUrl);

    const result = await upsertContractAction(formData);

    if (result.success) {
      toast.success(result.message);
      onFormSubmit();
      if (result.isNew) onSuccess();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && <input type="hidden" name="contractId" value={contract.id} />}

      <div className="space-y-2 flex flex-col">
        <Label>Cliente *</Label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between bg-gray-800 border-gray-700">
                    {selectedClientId ? clients.find((c) => c.id === selectedClientId)?.tradeName : "Selecione um cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar cliente..." />
                    <CommandEmpty>Cliente não encontrado.</CommandEmpty>
                    <CommandGroup>
                        {clients.map((client) => (
                            <CommandItem key={client.id} value={client.tradeName} onSelect={() => { setSelectedClientId(client.id); setOpenCombobox(false); }}>
                                <Check className={`mr-2 h-4 w-4 ${selectedClientId === client.id ? "opacity-100" : "opacity-0"}`} />
                                {client.tradeName}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
        <Link href="/gestor/clientes" className="text-xs text-m2-green hover:underline block">
            + Cadastrar novo cliente
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valueDisplay">Valor Total</Label>
            <Input 
                id="valueDisplay" 
                name="valueDisplay" 
                value={valueDisplay}
                onChange={handleCurrencyChange}
                className="bg-gray-800 border-gray-700" 
                placeholder="R$ 0,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status de Pagamento</Label>
            <Select name="status" defaultValue={contract?.status || 'PENDING'}>
                <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
            </Select>
          </div>
      </div>

      <div className="space-y-2 w-full">
        <Label>Arquivo do Contrato (PDF)</Label>
        <Input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />

        <div className="flex items-center gap-3 p-3 border border-gray-700 rounded-md bg-gray-800/50 w-full max-w-full overflow-hidden">
            <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0" 
            >
                <Upload size={16} className="mr-2" />
                Escolher arquivo
            </Button>
            
            <div className="flex-1 min-w-0 text-sm text-gray-300">
                {file ? (
                    <p className="truncate text-m2-green font-medium" title={file.name}>
                        {truncateFileName(file.name, 30)}
                    </p>
                ) : contract?.fileUrl ? (
                    <p className="truncate text-blue-400 flex items-center gap-1">
                         <FileText size={14} className="flex-shrink-0" /> Arquivo atual mantido
                    </p>
                ) : (
                    <p className="truncate text-gray-500 italic">Nenhum arquivo selecionado</p>
                )}
            </div>

            {file && (
                <button 
                    type="button" 
                    onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-gray-500 hover:text-red-400 flex-shrink-0 ml-2"
                    title="Remover seleção"
                >
                    <X size={16} />
                </button>
            )}
        </div>
        
        {contract?.fileUrl && !file && (
             <div className="mt-1">
                 <Link href={contract.fileUrl} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                    <ArrowRight size={10} /> Ver contrato atual em nova aba
                 </Link>
             </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea id="observations" name="observations" defaultValue={contract?.observations || ''} className="bg-gray-800 border-gray-700" />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/80">
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Contrato')}
        </Button>
      </DialogFooter>
    </form>
  );
}

function SuccessModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-m2-green">Contrato Criado!</DialogTitle>
                    <DialogDescription>
                        O contrato foi gerado com sucesso. O próximo passo é criar o projeto vinculado a ele.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
                    <Button asChild className="bg-m2-green text-black hover:bg-m2-green/80">
                        <Link href="/gestor/projetos">
                            Avançar para Projetos <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function ContractsClientPage({ initialContracts, clients, preSelectedClientId }: { 
    initialContracts: ContractWithClient[], 
    clients: {id: string, tradeName: string}[],
    preSelectedClientId?: string
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(!!preSelectedClientId);
  const [editingContract, setEditingContract] = useState<ContractWithClient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
        <div className="text-right">
            <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/80">
                <PlusCircle size={18} className="mr-2" />
                Novo Contrato
            </Button>
        </div>

        <div className="border border-gray-800 rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900/50">
                        <TableHead>Nº Contrato</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialContracts.map((contract) => (
                        <TableRow key={contract.id} className="border-gray-800">
                            <TableCell className="font-mono text-gray-300">{contract.contractNumber}</TableCell>
                            <TableCell className="font-medium">{contract.client.tradeName}</TableCell>
                            <TableCell>
                                <Badge className={
                                    contract.status === 'PAID' ? 'bg-green-900 text-green-200 hover:bg-green-900' :
                                    contract.status === 'CANCELLED' ? 'bg-red-900 text-red-200 hover:bg-red-900' :
                                    'bg-yellow-900 text-yellow-200 hover:bg-yellow-900'
                                }>
                                    {contract.status === 'PAID' ? 'Pago' : contract.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatExistingValue(contract.value)}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                {contract.fileUrl && (
                                    <Button variant="ghost" size="icon" asChild title="Ver contrato">
                                        <Link href={contract.fileUrl} target="_blank"><FileText size={16} /></Link>
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" onClick={() => setEditingContract(contract)}>
                                    <Edit size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialContracts.length === 0 && (
                         <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Nenhum contrato encontrado.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Novo Contrato</DialogTitle></DialogHeader>
                <ContractForm 
                    clients={clients}
                    preSelectedId={preSelectedClientId}
                    onFormSubmit={() => setIsCreateOpen(false)}
                    onSuccess={() => setShowSuccess(true)}
                />
            </DialogContent>
        </Dialog>

        <Dialog open={!!editingContract} onOpenChange={(isOpen) => !isOpen && setEditingContract(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Editar Contrato</DialogTitle></DialogHeader>
                {editingContract && (
                    <ContractForm 
                        contract={editingContract} 
                        clients={clients}
                        onFormSubmit={() => setEditingContract(null)}
                        onSuccess={() => {}}
                    />
                )}
            </DialogContent>
        </Dialog>

        <SuccessModal open={showSuccess} onOpenChange={setShowSuccess} />
    </>
  );
}