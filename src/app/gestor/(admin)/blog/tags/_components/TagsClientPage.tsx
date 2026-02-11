// src/app/gestor/(admin)/blog/tags/_components/TagsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Tag } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Tag as TagIcon, Hash } from 'lucide-react';
import { createTagAction, updateTagAction, deleteTagAction } from '../actions';

// --- SUBCOMPONENTE DE FORMULÁRIO ---
function TagForm({ tag, onFormSubmit }: { tag?: Tag, onFormSubmit: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!tag;

  const handleSubmit = async (formData: FormData) => {
    const action = isEditing ? updateTagAction : createTagAction;
    
    toast.promise(action(formData), {
      loading: isEditing ? 'Atualizando tag...' : 'Criando tag...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onFormSubmit();
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <form action={handleSubmit} ref={formRef} className="space-y-4 py-2">
      {isEditing && <input type="hidden" name="tagId" value={tag.id} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Tag</Label>
        <div className="relative">
          <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="name" 
            name="name" 
            defaultValue={tag?.name || ''} 
            required 
            placeholder="Ex: React, Novidades, Tutorial"
            className="pl-9 bg-background" // Padding left para o ícone e fundo do tema
          />
        </div>
      </div>

      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          type="submit"
          className="bg-m2-green hover:bg-m2-green/90 text-black font-medium"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Tag'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function TagsClientPage({ initialTags }: { initialTags: Tag[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleDelete = (tagId: string) => {
    toast.promise(deleteTagAction(tagId), {
      loading: 'Deletando...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <TagIcon className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            Gerenciar Tags
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Crie palavras-chave para melhorar a busca e filtragem dos seus posts.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-m2-green hover:bg-m2-green/90 text-black font-medium">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tag</DialogTitle>
              <DialogDescription>
                Adicione uma nova palavra-chave ao sistema.
              </DialogDescription>
            </DialogHeader>
            <TagForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* TABELA DE CONTEÚDO */}
      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead className="text-right w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTags.length > 0 ? (
              initialTags.map((tag) => (
                <TableRow key={tag.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground p-1 rounded">
                        <Hash className="h-3 w-3" />
                      </span>
                      {tag.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      
                      {/* Botão de Edição */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingTag(tag)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar {tag.name}</span>
                      </Button>

                      {/* Botão de Exclusão */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="h-8 w-8 bg-transparent text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir {tag.name}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir tag?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você está prestes a remover a tag <strong>&quot;{tag.name}&quot;</strong>.
                              <br />
                              Os posts associados não serão apagados, apenas perderão esta referência.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(tag.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Estado Vazio
              <TableRow>
                <TableCell colSpan={2} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Hash className="h-10 w-10 opacity-20" />
                    <p>Nenhuma tag criada ainda.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG DE EDIÇÃO */}
      <Dialog open={!!editingTag} onOpenChange={(isOpen) => !isOpen && setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
            <DialogDescription>
              Modifique o nome da tag selecionada.
            </DialogDescription>
          </DialogHeader>
          {editingTag && <TagForm tag={editingTag} onFormSubmit={() => setEditingTag(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}