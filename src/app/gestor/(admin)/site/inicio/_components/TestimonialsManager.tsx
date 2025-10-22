// src/app/gestor/(admin)/site/inicio/_components/TestimonialsManager.tsx
'use client';

import { useState, useRef } from 'react';
import type { Testimonial } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2, UploadCloud, Edit } from 'lucide-react'; // Adicionado ícone Edit
import { toast } from 'sonner';
import { createTestimonial, deleteTestimonial, updateTestimonial } from '../actions'; // Importa a action de update
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

// 1. FORMULÁRIO REUTILIZÁVEL PARA ADICIONAR/EDITAR
function TestimonialForm({ onFormSubmit, testimonial }: { onFormSubmit: () => void, testimonial?: Testimonial }) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // O preview da imagem começa com a imagem existente (se houver)
  const [imagePreview, setImagePreview] = useState(testimonial?.image || null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let imageUrl = testimonial?.image || ''; // Começa com a imagem antiga

    if (file) {
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error('Falha no upload.');
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error); // Adiciona o log do erro
        toast.error("Erro ao fazer upload da imagem.");
        setIsLoading(false);
        return;
      }
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set('image', imageUrl);

    // Decide qual action chamar: create ou update
    const result = testimonial 
      ? await updateTestimonial(testimonial.id, formData) 
      : await createTestimonial(formData);
    
    if (result.success) {
      toast.success(result.message);
      onFormSubmit(); // Fecha o dialog
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Campo de Upload */}
      <div className="space-y-2">
        <Label>Foto do Cliente</Label>
        <div className="w-full h-40 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-400 relative overflow-hidden">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="text-center"><UploadCloud size={32} className="mx-auto" /><p>Clique para selecionar</p></div>
          )}
        </div>
        <Input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          Selecionar Imagem
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required defaultValue={testimonial?.name || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Empresa/Cargo</Label>
        <Input id="company" name="company" required defaultValue={testimonial?.company || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quote">Citação</Label>
        <Textarea id="quote" name="quote" required rows={4} defaultValue={testimonial?.quote || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="highlight">Texto em Destaque (opcional)</Label>
        <Input id="highlight" name="highlight" placeholder="A parte da citação que ficará em verde" defaultValue={testimonial?.highlight || ''} className="bg-gray-800 border-gray-700" />
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Componente principal que lista os depoimentos
export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  // Estado para controlar a abertura dos dialogs de "Adicionar"
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = async (id: string) => {
    toast.promise(deleteTestimonial(id), {
      loading: 'Excluindo depoimento...',
      success: (result) => result.message,
      error: (result) => result.message,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seção de Depoimentos</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={18} className="mr-2" />
              Adicionar Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Novo Depoimento</DialogTitle>
            </DialogHeader>
            <TestimonialForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-lg">
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Nenhum depoimento cadastrado.</p>
        ) : (
          <ul className="divide-y divide-gray-800">
            {testimonials.map(testimonial => (
              <li key={testimonial.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image src={testimonial.image || '/assets/testimonials/exemplo1.jpg'} alt={testimonial.name} width={40} height={40} className="rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  
                  {/* 2. ADICIONA O DIALOG DE EDIÇÃO PARA CADA ITEM */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Editar Depoimento</DialogTitle>
                      </DialogHeader>
                      {/* Passa o 'testimonial' para o formulário funcionar em modo de edição */}
                      <TestimonialForm onFormSubmit={() => {}} testimonial={testimonial} />
                    </DialogContent>
                  </Dialog>
                  
                  {/* Botão de Excluir */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(testimonial.id)}>Sim, excluir</Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}