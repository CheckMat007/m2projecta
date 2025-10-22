// src/app/gestor/(admin)/portfolio/novo/_components/NovoPortfolioItemForm.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { createPortfolioItem } from '../../actions'; // Ajusta o caminho para ../../actions
import Link from 'next/link';
import Image from 'next/image';

// Botão de Submit com estado de loading
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button className="bg-m2-green text-black hover:bg-m2-green/80" type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Projeto'}
    </Button>
  );
}

// Componente para o contador de caracteres
const CharCounter = ({ text, max }: { text: string; max: number }) => (
  <p className={`text-xs text-right ${text.length > max ? 'text-red-500' : 'text-gray-500'}`}>
    {text.length} / {max}
  </p>
);

// O formulário recebe a contagem de destaques do "pai" (Componente de Servidor)
export function NovoPortfolioItemForm({ featuredCount, maxFeatured }: { featuredCount: number, maxFeatured: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Estados para os contadores de caracteres
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [category, setCategory] = useState('');

  // Lógica de desabilitar o switch
  const isFeaturedDisabled = featuredCount >= maxFeatured;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let coverImageUrl = '';
    if (!file) {
      toast.error("Por favor, selecione uma imagem de capa.");
      setIsSubmitting(false);
      return; 
    }

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

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('coverImage', coverImageUrl);
    formData.set('category', category); // Garante que o valor do Select seja enviado

    const result = await createPortfolioItem(formData);
    
    if (result && !result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
    } else {
      toast.success('Projeto criado com sucesso!');
      // O 'redirect' na action já cuida de nos levar de volta
    }
  }

  // Funções para Drag and Drop
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
    } else {
      toast.error("Por favor, solte apenas arquivos de imagem.");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Novo Item ao Portfólio</h1>
          <p className="text-gray-400">Preencha os dados do novo projeto.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/gestor/portfolio">
            <Button variant="outline" type="button" className="bg-transparent border-gray-600" disabled={isSubmitting}>Cancelar</Button>
          </Link>
          <SubmitButton isLoading={isSubmitting} />
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Seção Principal de Dados */}
       <div className="space-y-6">
         <h2 className="text-xl font-semibold">Informações Principais</h2>
         <div className="space-y-2">
           <Label htmlFor="title">Título do Projeto</Label>
           <Input id="title" name="title" placeholder="Ex: Vídeo Institucional TechCorp" className="bg-gray-800 border-gray-700" required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
           <CharCounter text={title} max={100} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="category">Categoria</Label>
           <Select name="category" value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Selecione uma categoria" />
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
           <Input id="shortDescription" name="shortDescription" placeholder="Uma breve descrição que aparece no card do portfólio." className="bg-gray-800 border-gray-700" required value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} maxLength={200} />
           <CharCounter text={shortDesc} max={200} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="longDescription">Descrição Longa (para a página do projeto)</Label>
           <Textarea id="longDescription" name="longDescription" placeholder="Descreva o desafio, a solução e os resultados do projeto..." className="bg-gray-800 border-gray-700" rows={6} required value={longDesc} onChange={(e) => setLongDesc(e.target.value)} />
           <p className="text-xs text-gray-500 text-right">{longDesc.length} caracteres</p>
         </div>
       </div>

      {/* Seção de Mídia */}
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
            {file ? (
              <Image src={URL.createObjectURL(file)} alt="Preview da capa" fill className="object-cover" />
            ) : (
              <div className="text-center pointer-events-none">
                <UploadCloud size={40} className="mx-auto" />
                <p>Arraste e solte ou clique no botão abaixo</p>
              </div>
            )}
          </div>
          <Input 
            id="coverImage" 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            accept="image/png, image/jpeg, image/webp"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white"
          >
            Selecionar Imagem
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL do Vídeo (YouTube)</Label>
          <Input id="videoUrl" name="videoUrl" type="text" placeholder="Cole o link de 'Compartilhar' (https://youtu.be/...) ou o link completo" className="bg-gray-800 border-gray-700" />
        </div>
      </div>

      {/* Seção de Publicação e SEO */}
       <div className="space-y-6">
         <h2 className="text-xl font-semibold">Publicação & SEO</h2>
         <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
           <div>
             <Label htmlFor="status" className="font-bold">Status do Projeto</Label>
             <p className="text-sm text-gray-400">PUBLICADO ficará visível no site. RASCUNHO ficará salvo apenas no painel.</p>
           </div>
           <Select name="status" defaultValue="DRAFT">
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