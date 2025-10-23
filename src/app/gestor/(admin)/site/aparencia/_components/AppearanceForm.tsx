// src/app/gestor/(admin)/site/aparencia/_components/AppearanceForm.tsx
'use client';

import { useState, useRef } from 'react';
import type { PageSettings } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';
import { updatePageSettings } from '../actions';

export function AppearanceForm({ aboutSettings }: { aboutSettings: PageSettings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(aboutSettings.heroImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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
        // A CORREÇÃO ESTÁ AQUI
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
    <Card className="bg-black/30 border-gray-800">
      <CardHeader>
        <CardTitle>Página SOBRE NÓS</CardTitle>
        <CardDescription>Edite a imagem de fundo da seção de abertura.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Imagem da Hero Section</Label>
          <div className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-400 relative overflow-hidden">
            {preview ? (
              <Image src={preview} alt="Preview da Hero" fill className="object-cover" />
            ) : (
              <UploadCloud size={40} />
            )}
          </div>
          <Input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Selecionar Imagem
          </Button>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Alterações"}
        </Button>
      </CardContent>
    </Card>
  );
}