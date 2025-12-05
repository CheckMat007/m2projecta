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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { PlusCircle, Edit, UploadCloud, Copy, Check, ArrowRight, User as UserIcon, MessageCircle, Trash2, AlertTriangle, FileDown } from 'lucide-react';
import { upsertClientAction, deleteClientAction } from '../actions';
import InputMask from 'react-input-mask';

// Tipo estendido para incluir usuário e contratos
type ClientWithDetails = Client & { 
    user: { email: string, image: string | null },
    contracts: { id: string, fileUrl: string | null, contractNumber: string }[]
};

// --- SUBCOMPONENTE: FORMULÁRIO DE CLIENTE ---
function ClientForm({ client, onFormSubmit, onSuccessWithCredentials }: { 
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && (
        <>
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="userId" value={client.userId} />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2 p-4 border border-dashed border-gray-700 rounded-lg bg-gray-900/50">
            <div className="w-20 h-20 relative rounded-full overflow-hidden border border-gray-600 bg-black flex items-center justify-center">
                 {preview ? <Image src={preview} alt="Logo" fill className="object-cover" /> : <UserIcon className="text-gray-500" />}
            </div>
            <input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={16} className="mr-2" /> Selecionar Logo
            </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeName">Nome Fantasia *</Label>
          <Input id="tradeName" name="tradeName" defaultValue={client?.tradeName} required className="bg-gray-800 border-gray-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Razão Social</Label>
          <Input id="companyName" name="companyName" defaultValue={client?.companyName || ''} className="bg-gray-800 border-gray-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ / CPF</Label>
          <InputMask 
            mask={cnpjValue.replace(/\D/g, '').length > 11 ? "99.999.999/9999-99" : "999.999.999-999"} 
            id="cnpj" 
            name="cnpj" 
            value={cnpjValue}
            onChange={(e) => setCnpjValue(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            placeholder="Digite CPF ou CNPJ"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">WhatsApp</Label>
          <InputMask mask="(99) 99999-9999" id="phone" name="phone" defaultValue={client?.phone || ''} className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail de Acesso *</Label>
        <Input id="email" name="email" type="email" defaultValue={client?.user.email} required className="bg-gray-800 border-gray-700" />
        <p className="text-xs text-gray-500">Será usado para o login na Área do Cliente.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Input id="address" name="address" defaultValue={client?.address || ''} className="bg-gray-800 border-gray-700" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações (Internas)</Label>
        <Textarea id="observations" name="observations" defaultValue={client?.observations || ''} className="bg-gray-800 border-gray-700" placeholder="Detalhes importantes sobre o cliente..." />
      </div>

      {isEditing && (
         <div className="flex items-center space-x-2 p-4 border border-yellow-900/50 bg-yellow-900/10 rounded-md">
            <Checkbox id="resetPassword" name="resetPassword" value="true" />
            <label htmlFor="resetPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-yellow-500">
              Gerar nova senha aleatória e forçar troca no próximo login
            </label>
         </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/80">
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Cliente' : 'Cadastrar e Gerar Acesso')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- SUBCOMPONENTE: MODAL DE CREDENCIAIS ---
function CredentialsModal({ open, onOpenChange, credentials }: { open: boolean, onOpenChange: (open: boolean) => void, credentials: { email: string, password?: string } | null }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!credentials?.password) return;
        const text = `Olá! Aqui estão seus dados de acesso à área do cliente M2 Projecta:\n\nLogin: ${credentials.email}\nSenha Provisória: ${credentials.password}\n\nAcesse em: https://www.m2projecta.com.br/cliente`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Dados copiados!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-m2-green">Cliente Cadastrado!</DialogTitle>
                    <DialogDescription>As credenciais de acesso foram geradas automaticamente.</DialogDescription>
                </DialogHeader>
                {credentials && (
                    <div className="bg-black p-4 rounded-md border border-gray-800 space-y-3 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Login:</span><span className="text-white select-all">{credentials.email}</span></div>
                        {credentials.password && (<div className="flex justify-between"><span className="text-gray-500">Senha:</span><span className="text-m2-green font-bold select-all">{credentials.password}</span></div>)}
                    </div>
                )}
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="secondary" onClick={handleCopy} className="w-full sm:w-auto">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} Copiar Dados</Button>
                    <Button asChild className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/80">
                        <Link href={`/gestor/contratos?newClientId=${credentials?.email}`}>Avançar para Contrato <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// --- SUBCOMPONENTE: MODAL DE EXCLUSÃO ---
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

    const hasContracts = client.contracts.some(c => c.fileUrl);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-red-900 bg-black">
                <DialogHeader>
                    <DialogTitle className="text-red-500 flex items-center gap-2"><AlertTriangle /> Excluir Cliente</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Você está prestes a excluir <strong>{client.tradeName}</strong>. Isso apagará todos os dados vinculados.
                        <span className="block mt-2 text-red-400 font-bold">Ação irreversível.</span>
                    </DialogDescription>
                </DialogHeader>

                {hasContracts && (
                    <div className="bg-gray-900 p-3 rounded-md border border-gray-800 my-2">
                        <p className="text-xs text-gray-400 mb-2">Recomendamos baixar os contratos:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {client.contracts.map(c => c.fileUrl && (
                                <a key={c.id} href={c.fileUrl} target="_blank" className="flex items-center gap-2 text-sm text-blue-400 hover:underline"><FileDown size={14} /> {c.contractNumber}</a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2 mt-4">
                    <Label htmlFor="del-pass">Senha de Gestor:</Label>
                    <Input id="del-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-900 border-gray-700" />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading || !password}>{isLoading ? 'Excluindo...' : 'Confirmar'}</Button>
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
    <>
        <div className="text-right">
            <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/80">
                <PlusCircle size={18} className="mr-2" /> Novo Cliente
            </Button>
        </div>

        <div className="border border-gray-800 rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900/50">
                        <TableHead>Cliente</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Email de Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialClients.map((client) => (
                        <TableRow key={client.id} className="border-gray-800">
                            <TableCell className="font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden relative border border-gray-600">
                                    {client.logoUrl ? <Image src={client.logoUrl} alt={client.tradeName} fill className="object-cover" /> : <span className="w-full h-full flex items-center justify-center text-xs">{client.tradeName.charAt(0)}</span>}
                                </div>
                                {client.tradeName}
                            </TableCell>
                            <TableCell>
                                {client.phone ? (
                                    <a href={getWhatsappLink(client.phone)!} target="_blank" className="flex items-center gap-2 hover:text-green-400 transition-colors" title="Abrir WhatsApp">
                                        {client.phone} <MessageCircle size={14} />
                                    </a>
                                ) : '-'}
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">{client.user.email}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => setEditingClient(client)}><Edit size={16} /></Button>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingClient(client)}><Trash2 size={16} /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialClients.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Nenhum cliente cadastrado.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
                <ClientForm onFormSubmit={() => setIsCreateOpen(false)} onSuccessWithCredentials={(creds) => setCredentialsData(creds)} />
            </DialogContent>
        </Dialog>
        
        <Dialog open={!!editingClient} onOpenChange={(isOpen) => !isOpen && setEditingClient(null)}>
             <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Editar Cliente</DialogTitle></DialogHeader>
                {editingClient && <ClientForm client={editingClient} onFormSubmit={() => setEditingClient(null)} onSuccessWithCredentials={(creds) => setCredentialsData(creds)} />}
            </DialogContent>
        </Dialog>

        <CredentialsModal open={!!credentialsData} onOpenChange={(open) => !open && setCredentialsData(null)} credentials={credentialsData} />
        <DeleteClientModal client={deletingClient} isOpen={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)} />
    </>
  );
}