// src/app/gestor/(admin)/clientes/_components/ClientsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Client } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { 
  PlusCircle, 
  Edit, 
  UploadCloud, 
  Copy, 
  Check, 
  ArrowRight,  
  MessageCircle, 
  Trash2, 
  AlertTriangle, 
  FileDown, 
  Users,
  Building2,
  Mail,
  MapPin
} from 'lucide-react';
import { upsertClientAction, deleteClientAction } from '../actions';
import InputMask from 'react-input-mask';

// --- TIPOS ---
type ClientWithDetails = Client & { 
    user: { email: string, image: string | null },
    contracts: { id: string, fileUrl: string | null, contractNumber: string }[]
};

// Estilo padrão para inputs do Shadcn (para aplicar no InputMask)
const SHADCN_INPUT_CLASS = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// --- FORMULÁRIO DE CLIENTE ---
function ClientForm({ 
  client, 
  onFormSubmit, 
  onSuccessWithCredentials 
}: { 
  client?: ClientWithDetails, 
  onFormSubmit: () => void,
  onSuccessWithCredentials: (creds: { email: string, password?: string }) => void
}) {
  const isEditing = !!client;
  const [isLoading, setIsLoading] = useState(false);
  const [cnpjValue, setCnpjValue] = useState(client?.cnpj || '');
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(client?.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set('cnpj', cnpjValue);

    let logoUrl = client?.logoUrl || '';
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload do logo");
        const newBlob = await uploadResponse.json();
        logoUrl = newBlob.url;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao fazer upload da imagem.");
        setIsLoading(false);
        return;
      }
    }
    formData.set('logoUrl', logoUrl);

    const result = await upsertClientAction(formData);

    if (result.success) {
      toast.success(result.message);
      onFormSubmit();
      if (result.credentials) {
        onSuccessWithCredentials(result.credentials);
      }
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {isEditing && (
        <>
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="userId" value={client.userId} />
        </>
      )}

      {/* Seção: Identidade Visual */}
      <div className="flex flex-col items-center gap-4">
          <div 
            className="group relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary cursor-pointer transition-colors bg-muted/20"
            onClick={() => fileInputRef.current?.click()}
          >
             {preview ? (
                <Image src={preview} alt="Logo Preview" fill className="object-cover" />
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary">
                    <UploadCloud size={20} />
                    <span className="text-[10px] mt-1 font-medium">Logo</span>
                </div>
             )}
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="text-white h-6 w-6" />
             </div>
          </div>
          <input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <p className="text-xs text-muted-foreground">Clique para alterar a logomarca</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seção: Dados da Empresa */}
        <div className="col-span-1 md:col-span-2 space-y-2">
           <Label htmlFor="tradeName" className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /> Nome Fantasia <span className="text-red-500">*</span></Label>
           <Input id="tradeName" name="tradeName" defaultValue={client?.tradeName} required placeholder="Ex: Minha Empresa Ltda" />
        </div>

        <div className="space-y-2">
           <Label htmlFor="companyName">Razão Social</Label>
           <Input id="companyName" name="companyName" defaultValue={client?.companyName || ''} placeholder="Razão social oficial" />
        </div>

        <div className="space-y-2">
           <Label htmlFor="cnpj">CNPJ / CPF</Label>
           <InputMask 
             mask={cnpjValue.replace(/\D/g, '').length > 11 ? "99.999.999/9999-99" : "999.999.999-999"} 
             id="cnpj" 
             name="cnpj" 
             value={cnpjValue}
             onChange={(e) => setCnpjValue(e.target.value)}
             className={SHADCN_INPUT_CLASS} 
             placeholder="00.000.000/0000-00"
           />
        </div>

        <div className="space-y-2">
           <Label htmlFor="phone">WhatsApp / Telefone</Label>
           <InputMask 
              mask="(99) 99999-9999" 
              id="phone" 
              name="phone" 
              defaultValue={client?.phone || ''} 
              className={SHADCN_INPUT_CLASS}
              placeholder="(00) 00000-0000"
           />
        </div>

        <div className="space-y-2">
           <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> E-mail de Acesso <span className="text-red-500">*</span></Label>
           <Input id="email" name="email" type="email" defaultValue={client?.user.email} required placeholder="cliente@email.com" />
        </div>
      </div>

      <div className="space-y-2">
         <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Endereço</Label>
         <Input id="address" name="address" defaultValue={client?.address || ''} placeholder="Rua, Número, Bairro, Cidade - UF" />
      </div>

      <div className="space-y-2">
         <Label htmlFor="observations">Observações Internas</Label>
         <Textarea id="observations" name="observations" defaultValue={client?.observations || ''} placeholder="Anotações sobre o cliente (visível apenas para admin)..." className="resize-none" rows={3} />
      </div>

      {isEditing && (
         <div className="flex items-start space-x-3 p-4 border border-amber-500/20 bg-amber-500/10 rounded-md">
            <Checkbox id="resetPassword" name="resetPassword" value="true" className="mt-1 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="resetPassword" className="text-sm font-medium leading-none text-amber-600 dark:text-amber-500 cursor-pointer">
                  Redefinir Credenciais
                </label>
                <p className="text-xs text-muted-foreground">
                  Se marcado, uma nova senha aleatória será gerada e exibida após salvar.
                </p>
            </div>
         </div>
      )}

      <DialogFooter className="pt-4">
        <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[140px]">
            {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- MODAL DE CREDENCIAIS ---
function CredentialsModal({ open, onOpenChange, credentials }: { open: boolean, onOpenChange: (open: boolean) => void, credentials: { email: string, password?: string } | null }) {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        if (!credentials?.password) return;
        const text = `Olá! Seguem seus dados de acesso:\n\nLogin: ${credentials.email}\nSenha: ${credentials.password}\n\nAcesse: https://www.m2projecta.com.br/cliente`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copiado para a área de transferência!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-m2-green/20 rounded-full flex items-center justify-center mb-2">
                        <Check className="h-6 w-6 text-m2-green" />
                    </div>
                    <DialogTitle className="text-center text-xl">Cadastro Realizado!</DialogTitle>
                    <DialogDescription className="text-center">
                        O cliente foi salvo e as credenciais de acesso foram geradas.
                    </DialogDescription>
                </DialogHeader>
                
                {credentials && (
                    <div className="bg-muted p-4 rounded-lg space-y-3 border border-border mt-2 relative overflow-hidden">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Login / E-mail</span>
                            <div className="font-mono text-sm bg-background p-2 rounded border border-border select-all">
                                {credentials.email}
                            </div>
                        </div>
                        {credentials.password && (
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha Provisória</span>
                                <div className="font-mono text-sm bg-background p-2 rounded border border-border font-bold text-foreground select-all">
                                    {credentials.password}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                    <Button variant="outline" onClick={handleCopy} className="w-full">
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} 
                        Copiar Dados
                    </Button>
                    <Button asChild className="w-full bg-m2-green text-black hover:bg-m2-green/90">
                        <Link href={`/gestor/contratos?newClientId=${credentials?.email}`}>
                            Ir para Contratos <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// --- MODAL DE EXCLUSÃO ---
function DeleteClientModal({ client, isOpen, onOpenChange }: { client: ClientWithDetails | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!client) return null;

    const handleDelete = async () => {
        setIsLoading(true);
        const result = await deleteClientAction(client.id, password);
        if (result.success) {
            toast.success(result.message);
            onOpenChange(false);
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
        setPassword('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" /> Excluir Cliente
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação removerá permanentemente o cliente <strong>{client.tradeName}</strong> e todos os dados vinculados.
                    </DialogDescription>
                </DialogHeader>

                {client.contracts.some(c => c.fileUrl) && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900 mb-2">
                        <p className="text-xs text-amber-800 dark:text-amber-400 font-medium mb-2">Contratos encontrados. Recomendamos o download:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {client.contracts.map(c => c.fileUrl && (
                                <a key={c.id} href={c.fileUrl} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    <FileDown size={14} /> {c.contractNumber}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3 py-2">
                    <Label htmlFor="del-pass" className="text-destructive font-medium">Confirme sua senha de administrador:</Label>
                    <Input 
                        id="del-pass" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="border-destructive/50 focus-visible:ring-destructive"
                        placeholder="Sua senha..."
                    />
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading || !password}>
                        {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// --- COMPONENTE PRINCIPAL ---
export function ClientsClientPage({ initialClients }: { initialClients: ClientWithDetails[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithDetails | null>(null);
  const [credentialsData, setCredentialsData] = useState<{ email: string, password?: string } | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientWithDetails | null>(null);

  const getWhatsappLink = (phone: string | null) => {
      if (!phone) return null;
      const clean = phone.replace(/\D/g, '');
      return `https://wa.me/55${clean}`;
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
                    Gerenciar Clientes
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Administre os cadastros e acessos dos seus clientes.
                </p>
            </div>
            
            <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium">
                <PlusCircle size={18} className="mr-2" /> Novo Cliente
            </Button>
        </div>

        {/* TABELA */}
        <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Empresa / Cliente</TableHead>
                        <TableHead className="hidden md:table-cell">Contato</TableHead>
                        <TableHead className="hidden sm:table-cell">Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialClients.length > 0 ? (
                        initialClients.map((client) => (
                            <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={client.logoUrl || undefined} alt={client.tradeName} className="object-cover" />
                                            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                                                {client.tradeName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{client.tradeName}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">{client.user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                
                                <TableCell className="hidden md:table-cell">
                                    {client.phone ? (
                                        <a 
                                            href={getWhatsappLink(client.phone)!} 
                                            target="_blank" 
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                                        >
                                            <MessageCircle size={12} /> {client.phone}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">—</span>
                                    )}
                                </TableCell>
                                
                                <TableCell className="hidden sm:table-cell">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} />
                                        {client.user.email}
                                    </div>
                                </TableCell>
                                
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setEditingClient(client)}
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        >
                                            <Edit size={16} />
                                            <span className="sr-only">Editar {client.tradeName}</span>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setDeletingClient(client)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 size={16} />
                                            <span className="sr-only">Excluir {client.tradeName}</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-48 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Users className="h-10 w-10 opacity-20" />
                                    <p>Nenhum cliente cadastrado ainda.</p>
                                    <Button variant="link" onClick={() => setIsCreateOpen(true)} className="text-m2-green">
                                        Cadastrar o primeiro
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* DIALOG DE CRIAÇÃO */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                    <DialogDescription>
                        Preencha os dados abaixo para cadastrar uma nova empresa e gerar acesso.
                    </DialogDescription>
                </DialogHeader>
                <ClientForm onFormSubmit={() => setIsCreateOpen(false)} onSuccessWithCredentials={(creds) => setCredentialsData(creds)} />
            </DialogContent>
        </Dialog>
        
        {/* DIALOG DE EDIÇÃO */}
        <Dialog open={!!editingClient} onOpenChange={(isOpen) => !isOpen && setEditingClient(null)}>
             <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                    <DialogDescription>
                        Atualize as informações de {editingClient?.tradeName}.
                    </DialogDescription>
                </DialogHeader>
                {editingClient && (
                    <ClientForm 
                        client={editingClient} 
                        onFormSubmit={() => setEditingClient(null)} 
                        onSuccessWithCredentials={(creds) => setCredentialsData(creds)} 
                    />
                )}
            </DialogContent>
        </Dialog>

        {/* MODAIS AUXILIARES */}
        <CredentialsModal open={!!credentialsData} onOpenChange={(open) => !open && setCredentialsData(null)} credentials={credentialsData} />
        <DeleteClientModal client={deletingClient} isOpen={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)} />
    </div>
  );
}