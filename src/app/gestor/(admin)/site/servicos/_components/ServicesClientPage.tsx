// src/app/gestor/(admin)/site/servicos/_components/ServicesClientPage.tsx
'use client';

import { useState, useRef } from 'react'; // 1. 'useEffect' foi removido daqui
import { useRouter } from 'next/navigation';
import type { Service } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog,AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2, Edit, UploadCloud, Building, Building2, Trees, Clapperboard, PartyPopper, Hotel, Info } from 'lucide-react';
import { toast } from 'sonner';
import { createService, deleteService, updateService } from '../actions';
import Image from 'next/image';

const iconOptions = [
  { value: 'Building', label: 'Imobiliário (Prédio 1)', icon: Building },
  { value: 'Building2', label: 'Imobiliário (Prédio 2)', icon: Building2 },
  { value: 'Hotel', label: 'Hotelaria', icon: Hotel },
  { value: 'Clapperboard', label: 'Corporativo (Claquete)', icon: Clapperboard },
  { value: 'PartyPopper', label: 'Eventos (Festa)', icon: PartyPopper },
  { value: 'Trees', label: 'Turismo (Árvores)', icon: Trees },
];

function ServiceForm({ onFormSubmit, service }: { onFormSubmit: () => void, service?: Service }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [icon, setIcon] = useState(service?.icon || '');
  const [preview, setPreview] = useState(service?.image || null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!icon) {
      toast.error("Por favor, selecione um ícone.");
      setIsLoading(false);
      return;
    }
    if (!file && !service) {
      toast.error("Por favor, selecione uma imagem de destaque.");
      setIsLoading(false);
      return;
    }

    let imageUrl = service?.image || '';
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error('Falha no upload.');
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error); // 2. 'error' agora está sendo usado
        toast.error("Erro ao fazer upload da imagem.");
        setIsLoading(false);
        return;
      }
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('image', imageUrl);
    formData.set('icon', icon);

    const result = service 
      ? await updateService(service.id, formData) 
      : await createService(formData);
    
    if (result && result.success) {
      toast.success(result.message);
      onFormSubmit();
      router.refresh();
    } else if (result) {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Serviço</Label>
        <Input id="name" name="name" required defaultValue={service?.name || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label>Ícone</Label>
        <div className="bg-blue-900/30 text-blue-300 border border-blue-400/20 p-3 rounded-md flex items-center gap-3 text-sm">
          <Info size={20} />
          <p>Clique em um dos ícones abaixo para selecioná-lo.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {iconOptions.map((option) => (
            <div 
              key={option.value}
              onClick={() => setIcon(option.value)}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors ${icon === option.value ? 'border-m2-green bg-m2-green/10' : 'border-gray-800 hover:bg-gray-800/50'}`}
            >
              <option.icon className="w-8 h-8 text-m2-green" />
              <p className="text-xs text-center">{option.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Descrição Curta</Label>
        <Textarea id="shortDescription" name="shortDescription" required defaultValue={service?.shortDescription || ''} rows={3} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="longDescription">Descrição Longa</Label>
        <Textarea id="longDescription" name="longDescription" required defaultValue={service?.longDescription || ''} rows={6} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label>Imagem de Destaque</Label>
        <div className="w-full h-40 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
          {preview ? <Image src={preview} alt="Preview" fill className="object-cover" /> : <UploadCloud size={32} />}
        </div>
        <Input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if(file) { setFile(file); setPreview(URL.createObjectURL(file)); } }} accept="image/*" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          {service ? 'Trocar Imagem' : 'Selecionar Imagem'}
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo do YouTube (Opcional)</Label>
        <Input id="videoUrl" name="videoUrl" defaultValue={service?.videoUrl ? `https://youtu.be/${service.videoUrl}` : ''} className="bg-gray-800 border-gray-700" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Serviço'}</Button>
      </DialogFooter>
    </form>
  );
}

export function ServicesClientPage({ services }: { services: Service[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = async (id: string) => {
    toast.promise(deleteService(id), {
      loading: 'Excluindo serviço...',
      success: (result) => {
        if (result.success) return result.message;
        throw new Error(result.message);
      },
      error: (result) => result.message,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Serviços</h1>
          <p className="text-gray-400">Crie e edite os serviços oferecidos no site.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
              <PlusCircle size={18} className="mr-2" />
              Adicionar Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Novo Serviço</DialogTitle></DialogHeader>
            <ServiceForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900/50">
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow><TableCell colSpan={2} className="text-center text-gray-500 py-10">Nenhum serviço cadastrado.</TableCell></TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className="border-gray-800">
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon"><Edit size={16} /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Editar Serviço</DialogTitle></DialogHeader>
                          <ServiceForm onFormSubmit={() => {}} service={service} />
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon"><Trash2 size={16} /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita e excluirá o serviço permanentemente.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild><Button variant="outline">Cancelar</Button></AlertDialogCancel>
                            <Button variant="destructive" onClick={() => handleDelete(service.id)}>Sim, excluir</Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}