// src/app/gestor/(admin)/site/inicio/_components/FaqManager.tsx
'use client';

import { useState, useRef } from 'react';
import type { FaqItem } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { createFaqItem, deleteFaqItem, updateFaqItem } from '../actions';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Formulário reutilizável para Adicionar/Editar
function FaqForm({ onFormSubmit, faqItem }: { onFormSubmit: () => void, faqItem?: FaqItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const result = faqItem 
      ? await updateFaqItem(faqItem.id, formData) 
      : await createFaqItem(formData);
    
    if (result.success) {
      toast.success(result.message);
      onFormSubmit(); // Fecha o dialog
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Pergunta</Label>
        <Input id="question" name="question" required defaultValue={faqItem?.question || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Resposta</Label>
        <Textarea id="answer" name="answer" required rows={5} defaultValue={faqItem?.answer || ''} className="bg-gray-800 border-gray-700" />
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

// Componente principal que lista os itens de FAQ
export function FaqManager({ faqItems }: { faqItems: FaqItem[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = async (id: string) => {
    toast.promise(deleteFaqItem(id), {
      loading: 'Excluindo pergunta...',
      success: (result) => result.message,
      error: (result) => result.message,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Perguntas Frequentes (FAQ)</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={18} className="mr-2" />
              Adicionar Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Pergunta</DialogTitle>
            </DialogHeader>
            <FaqForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="single" collapsible className="w-full border border-gray-800 rounded-lg">
        {faqItems.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Nenhuma pergunta cadastrada.</p>
        ) : (
          faqItems.map(item => (
            <AccordionItem key={item.id} value={item.id} className="px-4 border-b border-gray-800 last:border-b-0">
              <div className="flex items-center justify-between py-4">
                <AccordionTrigger className="text-left flex-1 hover:no-underline">{item.question}</AccordionTrigger>
                <div className="flex gap-2 ml-4">
                  {/* Botão de Editar */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Edit size={16} /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader><DialogTitle>Editar Pergunta</DialogTitle></DialogHeader>
                      <FaqForm onFormSubmit={() => {}} faqItem={item} />
                    </DialogContent>
                  </Dialog>
                  {/* Botão de Excluir */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon"><Trash2 size={16} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      {/* Adiciona a descrição que estava faltando */}
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. A pergunta será excluída permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(item.id)}>Sim, excluir</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <AccordionContent className="pb-4 text-gray-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>
    </div>
  );
}