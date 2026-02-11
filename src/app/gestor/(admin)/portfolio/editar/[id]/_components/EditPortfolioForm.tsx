// src/app/gestor/(admin)/portfolio/editar/[id]/_components/EditPortfolioForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { updatePortfolioItem } from '../../../actions';
import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioItem, Service } from '@prisma/client';

// --- SUBCOMPONENTES ---

// Botão de Submit
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[140px]" type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
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
export function EditPortfolioForm({ 
  item, 
  featuredCount, 
  maxFeatured, 
  services 
}: {
  item: PortfolioItem,
  featuredCount: number,
  maxFeatured: number,
  services: Service[]
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Imagem
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item.coverImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Estados dos inputs (para contadores)
  const [title, setTitle] = useState(item.title);
  const [shortDesc, setShortDesc] = useState(item.shortDescription);
  const [longDesc, setLongDesc] = useState(item.longDescription);
  const [seoTitle, setSeoTitle] = useState(item.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(item.seoDescription || '');
  const [serviceId, setServiceId] = useState(item.serviceId || '');
  
  // Controle de Destaque
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  // Desabilita se limite atingido E o item atual NÃO é destaque (para permitir remover destaque)
  const isFeaturedDisabled = featuredCount >= maxFeatured && !item.isFeatured;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let coverImageUrl = item.coverImage;

    // Upload de nova imagem (se houver)
    if (file) {
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
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('coverImage', coverImageUrl);

    const result = await updatePortfolioItem(item.id, formData);

    if (result && result.success) {
      if (result.message === 'Nenhuma alteração detectada.') {
        toast.info(result.message);
      } else {
        toast.success(result.message || 'Projeto atualizado!');
      }
      router.push('/gestor/portfolio');
      router.refresh(); // Garante que a lista atualize
    } else if (result && !result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
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
      setImagePreview(URL.createObjectURL(droppedFile));
    } else {
      toast.error("Apenas arquivos de imagem são permitidos.");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
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
                <h1 className="text-2xl font-bold tracking-tight">Editar Projeto</h1>
                <p className="text-sm text-muted-foreground">Atualize as informações do item do portfólio.</p>
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
                        <Select name="status" defaultValue={item.status}>
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
                            <Label htmlFor="isFeatured" className={`cursor-pointer ${isFeaturedDisabled ? 'opacity-50' : ''}`}>
                                Destaque na Home
                            </Label>
                            <Switch 
                                id="isFeatured" 
                                name="isFeatured" 
                                checked={isFeatured}
                                onCheckedChange={setIsFeatured}
                                disabled={isFeaturedDisabled} 
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isFeaturedDisabled 
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
                        <Select name="serviceId" value={serviceId} onValueChange={setServiceId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map(service => (
                                    <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                        />
                        
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
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                                        <span className="font-medium text-primary">Clique para alterar</span> ou arraste
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* URL de Vídeo */}
                    <div className="space-y-2">
                        <Label htmlFor="videoUrl" className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-500" /> Vídeo do YouTube
                        </Label>
                        <Input 
                            id="videoUrl" 
                            name="videoUrl" 
                            placeholder="https://youtu.be/..." 
                            defaultValue={item.videoUrl ? `https://youtu.be/${item.videoUrl}` : ''}
                        />
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
    </form>
  );
}