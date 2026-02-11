// src/app/gestor/(admin)/site/servicos/_components/ServicesClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Service } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react'; 
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  HelpCircle,
  Loader2,
  Briefcase,
  Youtube,
  UploadCloud
} from 'lucide-react';
import { upsertServiceAction, deleteService } from '../actions';

// --- UTILITÁRIOS ---
function normalizeIconName(input: string): string {
  if (!input) return '';
  const clean = input.trim();

  // @ts-expect-error - Verificando dinamicamente se a chave existe no objeto LucideIcons
  if (LucideIcons[clean]) return clean;

  const pascalCase = clean
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return pascalCase;
}

// --- FORMULÁRIO ---
function ServiceForm({ service, onFormSubmit }: { service?: Service, onFormSubmit: () => void }) {
  const isEditing = !!service;
  const [isLoading, setIsLoading] = useState(false);
  
  const [iconInput, setIconInput] = useState(service?.icon || '');
  const normalizedIconName = normalizeIconName(iconInput);
  
  // @ts-expect-error - Acesso dinâmico à biblioteca de ícones pode não ter tipagem exata
  const PreviewIcon = LucideIcons[normalizedIconName] || null;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(service?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      toast.error("Apenas imagens são permitidas.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    formData.set('icon', normalizedIconName);

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
    
    // Validação
    if (!imageUrl && !isEditing) {
        toast.error("A imagem de destaque é obrigatória.");
        setIsLoading(false);
        return;
    }
    
    formData.set('image', imageUrl);

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
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      {isEditing && <input type="hidden" name="serviceId" value={service.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Serviço <span className="text-red-500">*</span></Label>
        <Input 
            id="name" 
            name="name" 
            defaultValue={service?.name} 
            required 
            placeholder="Ex: Edição de Vídeo Institucional"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="icon" className="flex justify-between">
                <span>Ícone (Lucide) <span className="text-red-500">*</span></span>
                <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Ver ícones</a>
            </Label>
            <div className="flex gap-2">
                <Input 
                    id="icon" 
                    name="icon" 
                    value={iconInput}
                    onChange={(e) => setIconInput(e.target.value)}
                    required 
                    placeholder="Ex: arrow-right, video" 
                    className="flex-1"
                />
                <div className={`w-10 h-10 flex items-center justify-center border rounded-md shrink-0 transition-colors ${PreviewIcon ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'}`}>
                    {PreviewIcon ? <PreviewIcon size={20} className="text-primary" /> : <HelpCircle size={20} className="text-muted-foreground/50" />}
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                {PreviewIcon ? 
                    <span className="text-green-600 dark:text-green-400 font-medium">Ícone válido: {normalizedIconName}</span> : 
                    "Digite o nome em inglês (kebab-case ou PascalCase)."}
            </p>
         </div>
         <div className="space-y-2">
            <Label htmlFor="videoUrl" className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" /> ID do Vídeo (YouTube)
            </Label>
            <Input 
                id="videoUrl" 
                name="videoUrl" 
                defaultValue={service?.videoUrl || ''} 
                placeholder="Ex: dQw4w9WgXcQ" 
            />
            <p className="text-xs text-muted-foreground">Opcional. Código após o &quot;v=&quot; no link.</p>
         </div>
      </div>

      <div className="space-y-2">
        <Label>Imagem de Destaque (Capa) <span className="text-red-500">*</span></Label>
        <Input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        
        <div 
            className={`
                relative w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden bg-muted/10
                ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            {preview ? (
                <>
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-medium text-sm flex items-center gap-2">
                            <UploadCloud size={16} /> Alterar imagem
                        </p>
                    </div>
                </>
            ) : (
                <div className="p-4 space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Clique para enviar</p>
                        <p className="text-xs text-muted-foreground mt-1">ou arraste a imagem aqui</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Descrição Curta <span className="text-red-500">*</span></Label>
        <Textarea 
            id="shortDescription" 
            name="shortDescription" 
            defaultValue={service?.shortDescription} 
            required 
            rows={2} 
            placeholder="Aparece nos cards da página inicial."
            className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Descrição Longa (Detalhes) <span className="text-red-500">*</span></Label>
        <Textarea 
            id="longDescription" 
            name="longDescription" 
            defaultValue={service?.longDescription} 
            required 
            rows={5} 
            placeholder="Aparece na página interna do serviço."
        />
      </div>

      <DialogFooter className="pt-4">
        <DialogClose asChild>
            <Button type="button" variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[140px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Criar Serviço')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL (GRID LAYOUT) ---
export function ServicesClientPage({ initialServices }: { initialServices: Service[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = (id: string) => {
      toast.promise(deleteService(id), {
          loading: 'Excluindo serviço...',
          success: (result) => {
             if(!result.success) throw new Error(result.message);
             return result.message;
          },
          error: (error) => error.message
      })
  }

  const renderCardIcon = (iconName: string) => {
      // @ts-expect-error - Acesso dinâmico à biblioteca
      const Icon = LucideIcons[iconName] || HelpCircle;
      return <Icon size={22} className="text-primary" />;
  }

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden pb-20">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Briefcase className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
                    Serviços
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Gerencie o catálogo de serviços oferecidos no site.
                </p>
            </div>
            
            <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium shadow-sm">
                <PlusCircle size={18} className="mr-2" />
                Novo Serviço
            </Button>
        </div>

        {/* --- GRID DE CARDS --- */}
        {initialServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialServices.map((service) => (
                    <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full overflow-hidden relative mt-4">
                        
                        {/* Imagem de Capa (Com overflow-hidden para o zoom) */}
                        <div className="relative w-full h-40 bg-muted/40 border-b border-border overflow-hidden shrink-0">
                            {service.image ? (
                                <Image 
                                    src={service.image} 
                                    alt={service.name} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>

                        {/* Cabeçalho com o Ícone Flutuante Deslocado para Fora da Imagem */}
                        <CardHeader className="pt-0 pb-2 relative">
                            {/* Ícone posicionado absolutamente no CardHeader (não corta) */}
                            <div className="absolute -top-6 left-4 z-10">
                                <div className="h-12 w-12 bg-background rounded-xl border-2 border-border shadow-sm flex items-center justify-center">
                                    {renderCardIcon(service.icon)}
                                </div>
                            </div>

                            {/* O pt-8 empurra o título para baixo do ícone */}
                            <CardTitle className="text-lg font-bold leading-tight line-clamp-1 pt-8" title={service.name}>
                                {service.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="py-2 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {service.shortDescription}
                            </p>
                        </CardContent>

                        <Separator />

                        <CardFooter className="pt-3 pb-3 px-4 flex justify-end gap-2 bg-muted/20">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs font-medium border-dashed hover:border-primary hover:text-primary transition-colors flex-1"
                                onClick={() => setEditingService(service)}
                            >
                                <Edit className="mr-2 h-3.5 w-3.5" /> Editar
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 size={16} />
                                        <span className="sr-only">Excluir</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="sm:max-w-md w-[95vw] rounded-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação removerá o serviço <strong>{service.name}</strong> e poderá afetar itens do portfólio vinculados a ele. Confirma?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={() => handleDelete(service.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Sim, excluir
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>

                    </Card>
                ))}
            </div>
        ) : (
            // Estado Vazio
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Nenhum serviço cadastrado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Crie seu primeiro serviço para exibi-lo no menu principal e no portfólio.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/90 mt-2">
                    Adicionar Serviço
                </Button>
            </div>
        )}

        {/* DIALOG DE CRIAÇÃO */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle>Novo Serviço</DialogTitle>
                    <DialogDescription>Cadastre as informações do novo serviço.</DialogDescription>
                </DialogHeader>
                <ServiceForm onFormSubmit={() => setIsCreateOpen(false)} />
            </DialogContent>
        </Dialog>

        {/* DIALOG DE EDIÇÃO */}
        <Dialog open={!!editingService} onOpenChange={(isOpen) => !isOpen && setEditingService(null)}>
            <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle>Editar Serviço</DialogTitle>
                    <DialogDescription>Atualize os detalhes do serviço.</DialogDescription>
                </DialogHeader>
                {editingService && <ServiceForm service={editingService} onFormSubmit={() => setEditingService(null)} />}
            </DialogContent>
        </Dialog>

    </div>
  );
}