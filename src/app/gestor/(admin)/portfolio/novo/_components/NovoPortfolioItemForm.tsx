// src/app/gestor/(admin)/portfolio/novo/_components/NovoPortfolioItemForm.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Loader2,
  UploadCloud,
  ArrowLeft,
  Youtube,
  Globe,
  X,
  ImagePlus
} from 'lucide-react';
import { toast } from 'sonner';
import { createPortfolioItem } from '../../actions';
import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@prisma/client';

// --- SUBCOMPONENTES ---

// Botão de Submit
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[140px]" type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Projeto'}
    </Button>
  );
}

// Contador de Caracteres
const CharCounter = ({ current, max }: { current: number; max: number }) => (
  <span className={`text-xs ml-auto ${current > max ? 'text-destructive' : 'text-muted-foreground'}`}>
    {current}/{max}
  </span>
);

// --- COMPONENTE PRINCIPAL ---
export function NovoPortfolioItemForm({ 
  featuredCount, 
  maxFeatured, 
  services 
}: { 
  featuredCount: number, 
  maxFeatured: number,
  services: Service[] 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Galeria de fotos adicionais
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);

  // Estados dos inputs (para contadores)
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  
  // Controle de Destaque
  const [isFeatured, setIsFeatured] = useState(false);
  const isFeaturedDisabled = featuredCount >= maxFeatured;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let coverImageUrl = '';
    
    // Validação de Imagem
    if (!file) {
      toast.error("A imagem de capa é obrigatória.");
      setIsSubmitting(false);
      return; 
    }

    // Upload da Imagem
    try {
      const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      if (!uploadResponse.ok) throw new Error('Falha no upload da imagem.');
      const newBlob = await uploadResponse.json();
      coverImageUrl = newBlob.url;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer upload da imagem.");
      setIsSubmitting(false);
      return;
    }

    // Upload das imagens da galeria
    let galleryImageUrls: string[] = [];
    if (galleryFiles.length > 0) {
      try {
        galleryImageUrls = await Promise.all(
          galleryFiles.map(async (galleryFile) => {
            const uploadResponse = await fetch(`/api/upload?filename=${galleryFile.name}`, { method: 'POST', body: galleryFile });
            if (!uploadResponse.ok) throw new Error('Falha no upload de uma imagem da galeria.');
            const newBlob = await uploadResponse.json();
            return newBlob.url as string;
          })
        );
      } catch (error) {
        console.error(error);
        toast.error("Erro ao fazer upload das imagens da galeria.");
        setIsSubmitting(false);
        return;
      }
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('coverImage', coverImageUrl);
    formData.set('galleryImages', JSON.stringify(galleryImageUrls));

    // Server Action
    const result = await createPortfolioItem(formData);
    
    if (result && !result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
    } else if (result) {
      toast.success(result.message);
      // Redirecionamento é tratado pelo Server Action ou router.push se necessário
    }
  }

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    } else {
      toast.error("Apenas arquivos de imagem são permitidos.");
    }
  };

  // Galeria: adicionar/remover fotos
  const addGalleryFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error("Apenas arquivos de imagem são permitidos.");
      return;
    }
    setGalleryFiles((prev) => [...prev, ...imageFiles]);
  };
  const removeGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleGalleryDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsGalleryDragging(true); };
  const handleGalleryDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsGalleryDragging(false); };
  const handleGalleryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsGalleryDragging(false);
    if (e.dataTransfer.files?.length) addGalleryFiles(e.dataTransfer.files);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 pb-20">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
            <Link href="/gestor/portfolio">
                <Button variant="ghost" size="icon" type="button">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Novo Projeto</h1>
                <p className="text-sm text-muted-foreground">Preencha os detalhes para adicionar ao portfólio.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/gestor/portfolio" className="hidden sm:block">
                <Button variant="ghost" type="button">Cancelar</Button>
            </Link>
            <SubmitButton isLoading={isSubmitting} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA (Principal) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Card: Informações Básicas */}
            <Card>
                <CardHeader>
                    <CardTitle>Sobre o Projeto</CardTitle>
                    <CardDescription>Informações principais exibidas nos cards e na página de detalhes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="title">Título do Projeto <span className="text-red-500">*</span></Label>
                            <CharCounter current={title.length} max={100} />
                        </div>
                        <Input 
                            id="title" 
                            name="title" 
                            placeholder="Ex: Identidade Visual M2 Projecta" 
                            required 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            maxLength={100}
                            className="text-lg font-medium" 
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="shortDescription">Descrição Curta <span className="text-red-500">*</span></Label>
                            <CharCounter current={shortDesc.length} max={200} />
                        </div>
                        <Textarea 
                            id="shortDescription" 
                            name="shortDescription" 
                            placeholder="Resumo breve que aparecerá no card do projeto (vitrine)." 
                            required 
                            value={shortDesc} 
                            onChange={(e) => setShortDesc(e.target.value)} 
                            maxLength={200} 
                            rows={2}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="longDescription">Descrição Completa</Label>
                            <span className="text-xs text-muted-foreground">{longDesc.length} caracteres</span>
                        </div>
                        <Textarea 
                            id="longDescription" 
                            name="longDescription" 
                            placeholder="Conte a história do projeto: desafio, processo e resultados alcançados..." 
                            required 
                            value={longDesc} 
                            onChange={(e) => setLongDesc(e.target.value)} 
                            rows={8} 
                            className="resize-y"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Card: SEO */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Otimização para Buscadores (SEO)
                    </CardTitle>
                    <CardDescription>Melhore a visibilidade deste projeto no Google.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="seoTitle">Título SEO</Label>
                            <CharCounter current={seoTitle.length} max={60} />
                        </div>
                        <Input 
                            id="seoTitle" 
                            name="seoTitle" 
                            placeholder="Título otimizado para busca" 
                            value={seoTitle} 
                            onChange={(e) => setSeoTitle(e.target.value)} 
                            maxLength={60} 
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="seoDescription">Meta Descrição</Label>
                            <CharCounter current={seoDesc.length} max={160} />
                        </div>
                        <Textarea 
                            id="seoDescription" 
                            name="seoDescription" 
                            placeholder="Breve resumo que aparece nos resultados de busca." 
                            value={seoDesc} 
                            onChange={(e) => setSeoDesc(e.target.value)} 
                            maxLength={160} 
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* COLUNA DIREITA (Lateral) */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Card: Publicação */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <CardTitle>Publicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="DRAFT">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Rascunho</SelectItem>
                                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-md border border-border">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isFeatured" className={`cursor-pointer ${isFeaturedDisabled && !isFeatured ? 'opacity-50' : ''}`}>
                                Destaque na Home
                            </Label>
                            <Switch 
                                id="isFeatured" 
                                name="isFeatured" 
                                checked={isFeatured}
                                onCheckedChange={setIsFeatured}
                                disabled={isFeaturedDisabled && !isFeatured} 
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isFeaturedDisabled && !isFeatured 
                                ? "Limite de destaques atingido." 
                                : "Exibir no carrossel da página inicial."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Card: Organização */}
            <Card>
                <CardHeader>
                    <CardTitle>Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="serviceId">Serviço Relacionado <span className="text-red-500">*</span></Label>
                        <Select name="serviceId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map(service => (
                                    <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Define onde o projeto aparecerá no site.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Card: Mídia */}
            <Card>
                <CardHeader>
                    <CardTitle>Mídia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Upload de Imagem */}
                    <div className="space-y-2">
                        <Label>Imagem de Capa <span className="text-red-500">*</span></Label>
                        <Input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            accept="image/png, image/jpeg, image/webp"
                        />
                        
                        <div 
                            className={`
                                relative w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden
                                ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
                                ${file ? 'border-transparent' : ''}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {file ? (
                                <>
                                    <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium text-sm">Clique para alterar</p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 space-y-2">
                                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mx-auto">
                                        <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium text-primary">Clique para enviar</span> ou arraste
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/70">JPG, PNG ou WEBP</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Galeria de Fotos */}
                    <div className="space-y-2">
                        <Label>Galeria de Fotos</Label>
                        <p className="text-xs text-muted-foreground">Fotos adicionais exibidas na página do projeto, além da capa.</p>
                        <Input
                            type="file"
                            multiple
                            className="hidden"
                            ref={galleryInputRef}
                            onChange={(e) => { if (e.target.files) addGalleryFiles(e.target.files); e.target.value = ''; }}
                            accept="image/png, image/jpeg, image/webp"
                        />
                        <div className="grid grid-cols-3 gap-2">
                            {galleryFiles.map((galleryFile, index) => (
                                <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border group">
                                    <Image src={URL.createObjectURL(galleryFile)} alt={`Foto da galeria ${index + 1}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryFile(index)}
                                        className="absolute top-1 right-1 bg-black/70 hover:bg-destructive text-white rounded-full p-1 transition-colors"
                                        aria-label="Remover foto"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <div
                                className={`
                                    relative aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer transition-all
                                    ${isGalleryDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
                                `}
                                onDragOver={handleGalleryDragOver}
                                onDragLeave={handleGalleryDragLeave}
                                onDrop={handleGalleryDrop}
                                onClick={() => galleryInputRef.current?.click()}
                            >
                                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* URL de Vídeo */}
                    <div className="space-y-2">
                        <Label htmlFor="videoUrl" className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-500" /> Vídeo do YouTube
                        </Label>
                        <Input id="videoUrl" name="videoUrl" placeholder="https://youtu.be/... ou .../shorts/..." />
                        <p className="text-xs text-muted-foreground">Opcional. Aceita vídeos normais e Shorts (a orientação é detectada automaticamente).</p>
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
    </form>
  );
}