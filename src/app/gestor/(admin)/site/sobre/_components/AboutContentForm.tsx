// src/app/gestor/(admin)/site/sobre/_components/AboutContentForm.tsx
'use client';

import { useState, useRef } from 'react';
import type { AboutPageContent } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';
import { updateAboutContent } from '../actions';

export function AboutContentForm({ content }: { content: AboutPageContent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState(content.mainImageUrl);

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

    let imageUrl = content.mainImageUrl || '';
    
    // Se uma nova imagem foi selecionada, faz o upload
    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload");
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        // A CORREÇÃO ESTÁ AQUI
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Seção</Label>
        <Input id="title" name="title" defaultValue={content.title} required className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mainText">Texto Principal</Label>
        <Textarea id="mainText" name="mainText" defaultValue={content.mainText} required rows={8} className="bg-gray-800 border-gray-700" />
        <p className="text-xs text-gray-500">Para criar parágrafos, basta pressionar ENTER. O site irá respeitar as quebras de linha.</p>
      </div>
      <div className="space-y-2">
        <Label>Imagem da Seção</Label>
        <div className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
          {preview ? <Image src={preview} alt="Preview da imagem da seção" fill className="object-cover" /> : <UploadCloud size={40} />}
        </div>
        <Input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Selecionar Imagem</Button>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Conteúdo Principal"}
      </Button>
    </form>
  );
}