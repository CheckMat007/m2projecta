// src/app/gestor/(admin)/portfolio/editar/[id]/_components/EditPortfolioForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { updatePortfolioItem } from '../../../actions';
import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioItem } from '@prisma/client';

// Botão de Submit
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button className="bg-m2-green text-black hover:bg-m2-green/80" type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
    </Button>
  );
}

// Componente de Contador
const CharCounter = ({ text, max }: { text: string; max: number }) => (
  <p className={`text-xs text-right ${text.length > max ? 'text-red-500' : 'text-gray-500'}`}>
    {text.length} / {max}
  </p>
);

// O formulário recebe o 'item' e as contagens
export function EditPortfolioForm({ item, featuredCount, maxFeatured }: { 
  item: PortfolioItem, 
  featuredCount: number, 
  maxFeatured: number 
}) {
  const router = useRouter(); // Para o redirecionamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Estados para os contadores (inicializados com os dados do item)
  const [title, setTitle] = useState(item.title);
  const [shortDesc, setShortDesc] = useState(item.shortDescription);
  const [longDesc, setLongDesc] = useState(item.longDescription);
  const [seoTitle, setSeoTitle] = useState(item.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(item.seoDescription || '');
  const [category, setCategory] = useState(item.category);
  
  // Estado para o preview da imagem (começa com a imagem salva)
  const [imagePreview, setImagePreview] = useState(item.coverImage);

  // Lógica de desabilitar o switch
  const isFeaturedDisabled = featuredCount >= maxFeatured && !item.isFeatured;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let coverImageUrl = item.coverImage; // Começa com a imagem antiga

    // 1. Se um NOVO arquivo foi selecionado, faz o upload
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error('Falha no upload da imagem.');
        const newBlob = await uploadResponse.json();
        coverImageUrl = newBlob.url;
        toast.info('Upload da imagem concluído. Salvando projeto...');
      } catch (error) {
        console.error(error);
        toast.error("Erro ao fazer upload da imagem.");
        setIsSubmitting(false);
        return;
      }
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('coverImage', coverImageUrl); // Garante que a URL da imagem (antiga ou nova) esteja no form
    formData.set('category', category); // Garante que o valor do Select seja enviado

    // Chama a action de ATUALIZAÇÃO, passando o ID
    const result = await updatePortfolioItem(item.id, formData);
    
    // Lógica de feedback e redirecionamento
    if (result && result.success) {
      if (result.message === 'Nenhuma alteração detectada.') {
        toast.info(result.message);
      } else {
        toast.success(result.message || 'Projeto atualizado!');
      }
      router.push('/gestor/portfolio'); // Redireciona para a lista
    } else if (result && !result.success) {
      toast.error(result.message);
      setIsSubmitting(false); // Permite tentar novamente
    }
  }

  // Funções de Drag and Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setImagePreview(URL.createObjectURL(droppedFile)); // Atualiza o preview
    } else {
      toast.error("Por favor, solte apenas arquivos de imagem.");
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Editar Item do Portfólio</h1>
          <p className="text-gray-400">Modifique os dados do projeto.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/gestor/portfolio">
            <Button variant="outline" type="button" className="bg-transparent border-gray-600" disabled={isSubmitting}>Cancelar</Button>
          </Link>
          <SubmitButton isLoading={isSubmitting} />
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Seção Principal (com 'defaultValue' dos dados do item) */}
       <div className="space-y-6">
         <h2 className="text-xl font-semibold">Informações Principais</h2>
         <div className="space-y-2">
           <Label htmlFor="title">Título do Projeto</Label>
           <Input id="title" name="title" className="bg-gray-800 border-gray-700" required defaultValue={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
           <CharCounter text={title} max={100} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="category">Categoria</Label>
           <Select name="category" defaultValue={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing Imobiliário">Marketing Imobiliário</SelectItem>
                <SelectItem value="Vídeos Corporativos">Vídeos Corporativos</SelectItem>
                <SelectItem value="Cobertura de Evento">Cobertura de Evento</SelectItem>
                <SelectItem value="Turismo e Hotelaria">Turismo e Hotelaria</SelectItem>
                <SelectItem value="Acompanhamento de Obra">Acompanhamento de Obra</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
           </Select>
         </div>
         <div className="space-y-2">
           <Label htmlFor="shortDescription">Descrição Curta (para o card)</Label>
           <Input id="shortDescription" name="shortDescription" className="bg-gray-800 border-gray-700" required defaultValue={shortDesc} onChange={(e) => setShortDesc(e.target.value)} maxLength={200} />
           <CharCounter text={shortDesc} max={200} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="longDescription">Descrição Longa (para a página do projeto)</Label>
           <Textarea id="longDescription" name="longDescription" className="bg-gray-800 border-gray-700" rows={6} required defaultValue={longDesc} onChange={(e) => setLongDesc(e.target.value)} />
           <p className="text-xs text-gray-500 text-right">{longDesc.length} caracteres</p>
         </div>
       </div>

      {/* Seção de Mídia (com preview da imagem salva) */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Mídia</h2>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Imagem de Capa (Obrigatório)</Label>
          <div 
            className={`w-full h-64 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-400 relative overflow-hidden transition-colors ${isDragging ? 'bg-gray-800' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview da capa" fill className="object-cover" />
            ) : (
              <div className="text-center pointer-events-none">
                <UploadCloud size={40} className="mx-auto" />
                <p>Arraste e solte ou clique no botão abaixo</p>
              </div>
            )}
          </div>
          <Input id="coverImage" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
            Selecionar Nova Imagem
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL do Vídeo (YouTube)</Label>
          <Input id="videoUrl" name="videoUrl" type="text" placeholder="Cole o link de 'Compartilhar'..." className="bg-gray-800 border-gray-700" 
            defaultValue={item.videoUrl ? `https://youtu.be/${item.videoUrl}` : ''}
          />
        </div>
      </div>

      {/* Seção de Publicação (com 'defaultValue' do item) */}
       <div className="space-y-6">
         <h2 className="text-xl font-semibold">Publicação & SEO</h2>
         <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
           <div>
             <Label htmlFor="status" className="font-bold">Status do Projeto</Label>
             <p className="text-sm text-gray-400"> PUBLICADO ficará visível no site. RASCUNHO ficará salvo apenas no painel.</p>
           </div>
           <Select name="status" defaultValue={item.status}>
             <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="PUBLISHED">Publicado</SelectItem>
               <SelectItem value="DRAFT">Rascunho</SelectItem>
             </SelectContent>
           </Select>
         </div>
         <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
           <div>
             <Label htmlFor="isFeatured" className={`font-bold ${isFeaturedDisabled ? 'text-gray-500' : ''}`}>Destaque na Página Inicial</Label>
             <p className="text-sm text-gray-400">Ative para este projeto aparecer no slider da página inicial.</p>
           </div>
           <div>
             <Switch 
               id="isFeatured" 
               name="isFeatured" 
               defaultChecked={item.isFeatured}
               disabled={isFeaturedDisabled}
             />
             {isFeaturedDisabled && (
                <p className="text-xs text-yellow-500 text-right mt-1">Limite atingido.</p>
             )}
           </div>
         </div>
         <div className="space-y-2">
           <Label htmlFor="seoTitle">Título SEO (Opcional)</Label>
           <Input id="seoTitle" name="seoTitle" placeholder="Título que aparecerá no Google (máx 60 caracteres)" className="bg-gray-800 border-gray-700" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60} />
           <CharCounter text={seoTitle} max={60} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="seoDescription">Descrição SEO (Opcional)</Label>
           <Textarea id="seoDescription" name="seoDescription" placeholder="Descrição que aparecerá no Google (máx 160 caracteres)" className="bg-gray-800 border-gray-700" rows={3} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={160} />
           <CharCounter text={seoDesc} max={160} />
         </div>
       </div>
    </form>
  );
}