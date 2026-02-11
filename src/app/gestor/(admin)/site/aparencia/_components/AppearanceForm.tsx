// src/app/gestor/(admin)/site/aparencia/_components/AppearanceForm.tsx
'use client';

import { useState, useRef } from 'react';
import type { PageSettings } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Loader2, UploadCloud, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';
import { updatePageSettings } from '../actions';

export function AppearanceForm({ aboutSettings }: { aboutSettings: PageSettings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(aboutSettings.heroImageUrl);
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

  const handleSave = async () => {
    setIsLoading(true);
    let imageUrl = aboutSettings.heroImageUrl || '';

    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload");
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error("Erro ao fazer upload da nova imagem.");
        setIsLoading(false);
        return;
      }
    }
    
    const result = await updatePageSettings("ABOUT", imageUrl);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          Página &quot;Sobre Nós&quot;
        </CardTitle>
        <CardDescription>
          Personalize a imagem de fundo (Hero Section) exibida no topo da página.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Imagem de Destaque</Label>
            <span className="text-xs text-muted-foreground">Recomendado: 1920x1080px</span>
          </div>

          <Input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/webp" 
          />

          {/* Área de Upload (Dropzone) Widescreen */}
          <div 
              className={`
                  relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden bg-muted/10
                  ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
          >
              {preview ? (
                  <>
                      <Image src={preview} alt="Preview da Hero Section" fill className="object-cover" />
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
                          <p className="text-sm font-medium text-foreground">Clique para enviar a imagem de fundo</p>
                          <p className="text-xs text-muted-foreground mt-1">ou arraste e solte o arquivo aqui</p>
                      </div>
                  </div>
              )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-end border-t border-border mt-4">
        <Button 
            onClick={handleSave} 
            disabled={isLoading || (!file && preview === aboutSettings.heroImageUrl)}
            className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[160px]"
        >
          {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
          ) : (
              "Salvar Alterações"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}