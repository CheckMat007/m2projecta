// src/app/gestor/(admin)/site/inicio/_components/FaqManager.tsx
'use client';

import { useState, useRef } from 'react';
import type { FaqItem } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2, Edit, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createFaqItem, deleteFaqItem, updateFaqItem } from '../actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- SUBCOMPONENTE: FORMULÁRIO DE FAQ ---
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="question">Pergunta <span className="text-red-500">*</span></Label>
        <Input 
            id="question" 
            name="question" 
            required 
            defaultValue={faqItem?.question || ''} 
            placeholder="Ex: Como funciona o prazo de entrega?"
            className="bg-background" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Resposta <span className="text-red-500">*</span></Label>
        <Textarea 
            id="answer" 
            name="answer" 
            required 
            rows={5} 
            defaultValue={faqItem?.answer || ''} 
            placeholder="Descreva a resposta de forma clara e direta..."
            className="bg-background resize-y" 
        />
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[100px]">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function FaqManager({ faqItems }: { faqItems: FaqItem[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const handleDelete = async (id: string) => {
    toast.promise(deleteFaqItem(id), {
      loading: 'Excluindo pergunta...',
      success: (result) => result.message,
      error: (result) => result.message,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Botão de Adição no topo direito */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/90 font-medium">
          <PlusCircle size={18} className="mr-2" />
          Nova Pergunta
        </Button>
      </div>

      {/* Lista de FAQs em Accordion */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
          {faqItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                <HelpCircle className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhuma pergunta cadastrada na página inicial.</p>
                <Button variant="link" onClick={() => setIsCreateOpen(true)} className="text-primary p-0">
                    Adicionar a primeira pergunta
                </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-border px-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="text-left flex-1 py-4 hover:no-underline text-sm sm:text-base font-medium pr-4">
                        {item.question}
                    </AccordionTrigger>
                    
                    {/* Ações (Editar / Excluir) */}
                    <div className="flex gap-1 ml-2 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingFaq(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit size={16} />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md w-[95vw] rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação removerá a pergunta &quot;<strong>{item.question}</strong>&quot; do site. Não é possível desfazer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <AccordionContent className="pb-4 pt-1 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
      </div>

      {/* DIALOG DE CRIAÇÃO */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Nova Pergunta</DialogTitle>
            <DialogDescription>Adicione uma dúvida frequente para seus visitantes.</DialogDescription>
          </DialogHeader>
          <FaqForm onFormSubmit={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* DIALOG DE EDIÇÃO */}
      <Dialog open={!!editingFaq} onOpenChange={(isOpen) => !isOpen && setEditingFaq(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Editar Pergunta</DialogTitle>
            <DialogDescription>Atualize o conteúdo desta dúvida frequente.</DialogDescription>
          </DialogHeader>
          {editingFaq && (
            <FaqForm onFormSubmit={() => setEditingFaq(null)} faqItem={editingFaq} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}