// src/app/gestor/(admin)/site/servicos/_components/ServicesClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Service } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
// CORREÇÃO AQUI: Importamos a nova action unificada 'upsertServiceAction'
import { upsertServiceAction, deleteService } from '../actions';

function ServiceForm({ service, onFormSubmit }: { service?: Service, onFormSubmit: () => void }) {
  const isEditing = !!service;
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de Upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(service?.image || null);
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

    // 1. Upload da Imagem (se houver novo arquivo)
    let imageUrl = service?.image || '';
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload");
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao fazer upload da imagem.");
        setIsLoading(false);
        return;
      }
    }
    formData.set('image', imageUrl);

    // 2. Enviar para a nova Server Action unificada (Upsert)
    const result = await upsertServiceAction(formData);

    if (result.success) {
      toast.success(result.message);
      onFormSubmit();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && <input type="hidden" name="serviceId" value={service.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Serviço</Label>
        <Input id="name" name="name" defaultValue={service?.name} required className="bg-gray-800 border-gray-700" />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="icon">Nome do Ícone (Lucide)</Label>
            <Input id="icon" name="icon" defaultValue={service?.icon} required className="bg-gray-800 border-gray-700" placeholder="Ex: Camera, Video, Box" />
            <p className="text-xs text-gray-500">Nome exato do ícone da biblioteca Lucide React.</p>
         </div>
         <div className="space-y-2">
            <Label htmlFor="videoUrl">ID do Vídeo (YouTube)</Label>
            <Input id="videoUrl" name="videoUrl" defaultValue={service?.videoUrl || ''} className="bg-gray-800 border-gray-700" placeholder="Ex: dQw4w9WgXcQ" />
         </div>
      </div>

      {/* Upload de Imagem */}
      <div className="space-y-2">
        <Label>Imagem de Destaque (Hero)</Label>
        <Input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        
        <div className="w-full aspect-video relative rounded-md overflow-hidden border border-gray-700 bg-gray-900 flex items-center justify-center group">
            {preview ? (
                <>
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Trocar Imagem</Button>
                    </div>
                </>
            ) : (
                <Button type="button" variant="ghost" className="flex flex-col gap-2" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={32} className="text-gray-500" />
                    <span className="text-gray-500">Selecionar Imagem</span>
                </Button>
            )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Descrição Curta</Label>
        <Textarea id="shortDescription" name="shortDescription" defaultValue={service?.shortDescription} required className="bg-gray-800 border-gray-700" rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Descrição Longa (Detalhes)</Label>
        <Textarea id="longDescription" name="longDescription" defaultValue={service?.longDescription} required className="bg-gray-800 border-gray-700" rows={5} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/80">
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Serviço' : 'Criar Serviço')}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ServicesClientPage({ initialServices }: { initialServices: Service[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = (id: string) => {
      toast.promise(deleteService(id), {
          loading: 'Deletando...',
          success: (result) => {
             if(!result.success) throw new Error(result.message);
             return result.message;
          },
          error: (error) => error.message
      })
  }

  return (
    <>
        <div className="text-right">
            <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/80">
                <PlusCircle size={18} className="mr-2" />
                Novo Serviço
            </Button>
        </div>

        <div className="border border-gray-800 rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900/50">
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição Curta</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialServices.map((service) => (
                        <TableRow key={service.id} className="border-gray-800">
                            <TableCell className="font-medium flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md overflow-hidden relative bg-gray-800">
                                    <Image src={service.image} alt={service.name} fill className="object-cover" />
                                </div>
                                {service.name}
                            </TableCell>
                            <TableCell className="max-w-md truncate text-gray-400">{service.shortDescription}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => setEditingService(service)}>
                                    <Edit size={16} />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon"><Trash2 size={16} /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                                            <AlertDialogDescription>Esta ação não pode ser desfeita. Isso removerá o serviço e desvinculará os itens de portfólio associados.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(service.id)}>Confirmar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Novo Serviço</DialogTitle></DialogHeader>
                <ServiceForm onFormSubmit={() => setIsCreateOpen(false)} />
            </DialogContent>
        </Dialog>

        <Dialog open={!!editingService} onOpenChange={(isOpen) => !isOpen && setEditingService(null)}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Editar Serviço</DialogTitle></DialogHeader>
                {editingService && <ServiceForm service={editingService} onFormSubmit={() => setEditingService(null)} />}
            </DialogContent>
        </Dialog>
    </>
  );
}