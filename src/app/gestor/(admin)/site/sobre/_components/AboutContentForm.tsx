// src/app/gestor/(admin)/site/sobre/_components/AboutContentForm.tsx
'use client';

import { useState, useRef } from 'react';
import type { AboutPageContent } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, UploadCloud, Image as ImageIcon, Type, ImagePlus } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';
import { updateAboutContent } from '../actions';

export function AboutContentForm({ content }: { content: AboutPageContent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState(content.mainImageUrl);
  const [isDragging, setIsDragging] = useState(false);

  // --- HANDLERS ---
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
      toast.error("Por favor, solte apenas arquivos de imagem válidos.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let imageUrl = content.mainImageUrl || '';
    
    // Se uma nova imagem foi selecionada, faz o upload
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload");
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error("Erro ao fazer upload da imagem.");
        setIsLoading(false);
        return;
      }
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('mainImageUrl', imageUrl); // Garante que a URL (antiga ou nova) esteja no formulário

    const result = await updateAboutContent(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Textos */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5 text-primary" /> Textos Principais
                    </CardTitle>
                    <CardDescription>
                        Conte a história e a missão da sua empresa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Seção <span className="text-red-500">*</span></Label>
                        <Input 
                            id="title" 
                            name="title" 
                            defaultValue={content.title} 
                            required 
                            placeholder="Ex: Nossa História"
                            className="bg-background text-lg font-medium" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="mainText">Conteúdo Principal <span className="text-red-500">*</span></Label>
                            
                        </div>
                        <Textarea 
                            id="mainText" 
                            name="mainText" 
                            defaultValue={content.mainText} 
                            required 
                            rows={14} 
                            placeholder="Escreva sobre a empresa..."
                            className="bg-background resize-y leading-relaxed" 
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* COLUNA DIREITA: Imagem */}
        <div className="lg:col-span-1">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImagePlus className="h-5 w-5 text-primary" /> Imagem de Destaque
                    </CardTitle>
                    <CardDescription>
                        A imagem que acompanhará o texto.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Capa da Seção</Label>
                        <Input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/png, image/jpeg, image/webp" 
                        />
                        
                        {/* Dropzone Otimizado */}
                        <div 
                            className={`
                                relative w-full aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden bg-muted/10
                                ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {preview ? (
                                <>
                                    <Image src={preview} alt="Preview da seção Sobre" fill className="object-cover" />
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
                                        <p className="text-xs text-muted-foreground mt-1">ou arraste e solte</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60 uppercase font-semibold tracking-wider">
                                        JPG, PNG ou WEBP
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>

      {/* FOOTER DE AÇÃO */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[200px]"
        >
          {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
          ) : (
              "Salvar Conteúdo"
          )}
        </Button>
      </div>

    </form>
  );
}