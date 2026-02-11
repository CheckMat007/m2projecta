// src/app/gestor/(admin)/blog/categorias/_components/CategoriesClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Category } from '@prisma/client';
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
import { PlusCircle, Edit, Trash2, LayoutGrid, FolderOpen } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '../actions';

// --- SUBCOMPONENTE DE FORMULÁRIO ---
function CategoryForm({ 
  category, 
  onFormSubmit 
}: { 
  category?: Category, 
  onFormSubmit: () => void 
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!category;

  const handleSubmit = async (formData: FormData) => {
    const action = isEditing ? updateCategoryAction : createCategoryAction;
    
    // Feedback visual imediato via Toast
    toast.promise(action(formData), {
      loading: isEditing ? 'Atualizando categoria...' : 'Criando categoria...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onFormSubmit(); // Fecha o modal
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <form action={handleSubmit} ref={formRef} className="space-y-4 py-2">
      {isEditing && <input type="hidden" name="categoryId" value={category.id} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={category?.name || ''} 
          required 
          placeholder="Ex: Tecnologia, Tutoriais..."
          // Removido: bg-gray-800 border-gray-700 (Usa padrão do tema agora)
          className="bg-background"
        />
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
            type="submit" 
            className="bg-m2-green hover:bg-m2-green/90 text-black font-medium"
        >
            {isEditing ? 'Salvar Alterações' : 'Criar Categoria'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function CategoriesClientPage({ initialCategories }: { initialCategories: Category[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = (categoryId: string) => {
    toast.promise(deleteCategoryAction(categoryId), {
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
      
      {/* CABEÇALHO DA PÁGINA (Padronizado com Blog) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            Categorias
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Organize suas postagens agrupando-as por tópicos.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-m2-green hover:bg-m2-green/90 text-black font-medium">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para organizar o conteúdo do seu blog.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onFormSubmit={() => setIsCreateOpen(false)} />
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
            {initialCategories.length > 0 ? (
              initialCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      
                      {/* Botão de Edição */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingCategory(category)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar {category.name}</span>
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
                            <span className="sr-only">Excluir {category.name}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você está removendo a categoria <strong>&quot;{category.name}&quot;</strong>.
                              <br />
                              Posts vinculados a ela <strong>não serão apagados</strong>, mas perderão esta classificação.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleDelete(category.id)}
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
                    <FolderOpen className="h-10 w-10 opacity-20" />
                    <p>Nenhuma categoria encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG DE EDIÇÃO (Controlado via State) */}
      <Dialog open={!!editingCategory} onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
                Faça alterações no nome da categoria.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm 
                category={editingCategory} 
                onFormSubmit={() => setEditingCategory(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}