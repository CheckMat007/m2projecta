// src/app/gestor/(admin)/contratos/_components/ContractsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { Contract } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import {
  PlusCircle,
  Edit,
  FileText,
  ArrowRight,
  ChevronsUpDown,
  Check,
  UploadCloud,
  FileCheck,
  Briefcase,
  Paperclip,
  Sparkles
} from 'lucide-react';
import { upsertContractAction } from '../actions';

// --- UTILITÁRIOS ---
type ContractWithClient = Contract & { client: { tradeName: string } };

const formatExistingValue = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatInputCurrency = (value: number | string) => {
  const digits = value.toString().replace(/[^0-9]/g, '');
  const number = Number(digits) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};

const parseCurrency = (value: string) => {
  // Remove o símbolo R$, espaços e pontos de milhar, troca vírgula por ponto
  // Se a string formatada pelo Intl já estiver correta (ex: 1.000,00 -> 1000.00)
  // Mas como usamos a lógica de /100 no input, precisamos reverter:
  const digits = value.toString().replace(/[^0-9]/g, '');
  return Number(digits) / 100;
};

// --- FORMULÁRIO OTIMIZADO ---
function ContractForm({ 
  contract, 
  clients, 
  preSelectedId, 
  onFormSubmit, 
  onSuccess 
}: { 
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
  
  // Valor inicial formatado
  const [valueDisplay, setValueDisplay] = useState(
    contract ? formatExistingValue(contract.value) : ''
  );
  
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!selectedClientId) {
        toast.error("Selecione um cliente para continuar.");
        return;
    }

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set('clientId', selectedClientId);
    
    // Processa o valor monetário
    const rawValue = parseCurrency(valueDisplay || '0');
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
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="contractId" value={contract.id} />}

      {/* 1. Seleção de Cliente (Largura Total) */}
      <div className="grid gap-2">
        <Label className="text-sm font-medium">Cliente <span className="text-red-500">*</span></Label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    role="combobox" 
                    aria-expanded={openCombobox} 
                    className="w-full justify-between bg-background border-input"
                >
                    {selectedClientId 
                        ? clients.find((c) => c.id === selectedClientId)?.tradeName 
                        : "Selecione o cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar empresa..." />
                    <CommandList>
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem 
                                    key={client.id} 
                                    value={client.tradeName} 
                                    onSelect={() => { setSelectedClientId(client.id); setOpenCombobox(false); }}
                                >
                                    <Check className={`mr-2 h-4 w-4 ${selectedClientId === client.id ? "opacity-100" : "opacity-0"}`} />
                                    {client.tradeName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
      </div>

      {/* 2. Valor e Status (Grid Responsivo: 1 col mobile, 2 cols tablet+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="valueDisplay" className="text-sm font-medium">Valor Total</Label>
            <div className="relative">
                {/* Prefixo Visual R$ */}
                <div className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium select-none pointer-events-none">
                    
                </div>
                <Input 
                    id="valueDisplay" 
                    name="valueDisplay" 
                    value={valueDisplay} 
                    onChange={handleCurrencyChange} 
                    placeholder="R$ 0,00" 
                    className="pl-3 font-mono text-base" 
                />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select name="status" defaultValue={contract?.status || 'PENDING'}>
                <SelectTrigger className="bg-background">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">
                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"/> Pendente</div>
                    </SelectItem>
                    <SelectItem value="PAID">
                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"/> Pago / Ativo</div>
                    </SelectItem>
                    <SelectItem value="CANCELLED">
                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"/> Cancelado</div>
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>
      </div>

      {/* 3. Upload de Arquivo (Estilo Dropzone) */}
      <div className="grid gap-2">
        <Label className="text-sm font-medium">Documento do Contrato</Label>
        <Input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
        
        <div 
            className={`
                border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group
                ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
            `}
            onClick={() => fileInputRef.current?.click()}
        >
            {file ? (
                <>
                    <FileCheck className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground max-w-[200px] truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pronto para enviar</p>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="mt-3 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                    >
                        Remover seleção
                    </Button>
                </>
            ) : contract?.fileUrl ? (
                <>
                    <FileText className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-foreground">Contrato Anexado</p>
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Clique para substituir</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Link href={contract.fileUrl} target="_blank" className="text-xs text-blue-500 hover:underline z-10" onClick={e => e.stopPropagation()}>
                            Ver atual
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-foreground">Clique para selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC ou DOCX</p>
                </>
            )}
        </div>
      </div>

      {/* 4. Observações */}
      <div className="grid gap-2">
        <Label htmlFor="observations" className="text-sm font-medium">Observações</Label>
        <Textarea 
            id="observations" 
            name="observations" 
            defaultValue={contract?.observations || ''} 
            placeholder="Detalhes sobre vigência, forma de pagamento, etc."
            className="resize-none min-h-[80px]"
        />
      </div>

      <DialogFooter className="pt-4 gap-2 sm:gap-0">
        <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[120px]">
            {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Contrato' : 'Criar Contrato')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- MODAL SUCESSO ---
function SuccessModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-center text-xl">Sucesso!</DialogTitle>
                    <DialogDescription className="text-center">
                        O contrato foi salvo corretamente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Fechar</Button>
                    <Button asChild className="flex-1 bg-m2-green text-black hover:bg-m2-green/90">
                        <Link href="/gestor/projetos">Ir para Projetos <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// --- COMPONENTE PRINCIPAL ---
export function ContractsClientPage({ initialContracts, clients, preSelectedClientId }: { 
    initialContracts: ContractWithClient[], 
    clients: {id: string, tradeName: string}[],
    preSelectedClientId?: string
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(!!preSelectedClientId);
  const [editingContract, setEditingContract] = useState<ContractWithClient | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PAID': return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-green-500/20">Pago</Badge>;
        case 'CANCELLED': return <Badge variant="destructive">Cancelado</Badge>;
        default: return <Badge variant="secondary" className="text-yellow-600 dark:text-yellow-400 bg-yellow-500/15 border-yellow-500/20">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden pb-20">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Briefcase className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
                    Contratos
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Gerencie seus contratos de forma visual e rápida.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button asChild variant="outline" className="w-full sm:w-auto font-medium shadow-sm">
                    <Link href="/gestor/contratos/gerar">
                        <Sparkles size={18} className="mr-2" /> Gerar Contrato
                    </Link>
                </Button>
                <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium shadow-sm">
                    <PlusCircle size={18} className="mr-2" /> Novo Contrato
                </Button>
            </div>
        </div>

        {/* --- GRID DE CARDS (Layout Otimizado) --- */}
        {initialContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialContracts.map((contract) => (
                    <Card key={contract.id} className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 border-border bg-card flex flex-col">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">
                                    #{contract.contractNumber}
                                </span>
                                <CardTitle className="text-base font-semibold leading-tight line-clamp-1 pt-1" title={contract.client.tradeName}>
                                    {contract.client.tradeName}
                                </CardTitle>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {getStatusBadge(contract.status)}
                                {contract.isGenerated && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-m2-green/30 text-m2-green">
                                        <Sparkles size={10} className="mr-1" /> Gerado
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        
                        <CardContent className="py-4 flex-grow">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Valor Total</span>
                                <span className="text-2xl font-bold font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {formatExistingValue(contract.value)}
                                </span>
                            </div>
                        </CardContent>

                        <Separator />

                        <CardFooter className="pt-3 pb-3 px-4 flex gap-2 bg-muted/20">
                            {contract.fileUrl ? (
                                <Button variant="outline" size="sm" className="flex-1 h-9 border-dashed border-muted-foreground/30 hover:border-primary hover:text-primary" asChild>
                                    <Link href={contract.fileUrl} target="_blank">
                                        <Paperclip className="mr-2 h-3.5 w-3.5" />
                                        Ver PDF
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" className="flex-1 h-9 opacity-50 cursor-not-allowed bg-muted" disabled>
                                    Sem Anexo
                                </Button>
                            )}
                            
                            <Button variant="secondary" size="sm" className="h-9 px-3" onClick={() => setEditingContract(contract)}>
                                <Edit className="h-3.5 w-3.5" />
                                <span className="sr-only">Editar</span>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
            // Estado Vazio Otimizado
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Nenhum contrato encontrado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Crie seu primeiro contrato para começar a gerenciar pagamentos e documentos.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/90 mt-2">
                    Criar Primeiro Contrato
                </Button>
            </div>
        )}

        {/* MODAIS (Dialogs Responsivos) */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Novo Contrato</DialogTitle>
                    <DialogDescription>Preencha os dados do contrato abaixo.</DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
                    <ContractForm 
                        clients={clients}
                        preSelectedId={preSelectedClientId}
                        onFormSubmit={() => setIsCreateOpen(false)}
                        onSuccess={() => setShowSuccess(true)}
                    />
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={!!editingContract} onOpenChange={(isOpen) => !isOpen && setEditingContract(null)}>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Editar Contrato</DialogTitle>
                    <DialogDescription>Atualize as informações ou o documento.</DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
                    {editingContract && (
                        <ContractForm 
                            contract={editingContract} 
                            clients={clients}
                            onFormSubmit={() => setEditingContract(null)}
                            onSuccess={() => {}}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>

        <SuccessModal open={showSuccess} onOpenChange={setShowSuccess} />
    </div>
  );
}