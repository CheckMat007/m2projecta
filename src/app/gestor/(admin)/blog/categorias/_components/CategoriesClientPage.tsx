// src/app/gestor/(admin)/blog/categorias/_components/CategoriesClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '../actions';

// Subcomponente de formulário reutilizável
function CategoryForm({ category, onFormSubmit }: { category?: Category, onFormSubmit: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!category;

  const handleSubmit = async (formData: FormData) => {
    const action = isEditing ? updateCategoryAction : createCategoryAction;
    toast.promise(action(formData), {
      loading: isEditing ? 'Atualizando...' : 'Criando...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onFormSubmit();
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <form action={handleSubmit} ref={formRef} className="space-y-4">
      {isEditing && <input type="hidden" name="categoryId" value={category.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input id="name" name="name" defaultValue={category?.name || ''} required className="bg-gray-800 border-gray-700" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Categoria'}</Button>
      </DialogFooter>
    </form>
  );
}


// Componente principal da página
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
    <>
      <div className="text-right">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
              <PlusCircle size={18} className="mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <CategoryForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCategories.map((category) => (
              <TableRow key={category.id} className="border-gray-800">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}><Edit size={16} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 size={16} /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      {/* --- A CORREÇÃO PRINCIPAL ESTÁ AQUI --- */}
                      {/* Garantimos que a estrutura de aninhamento está correta */}
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Posts nesta categoria não serão deletados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCategory} onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && <CategoryForm category={editingCategory} onFormSubmit={() => setEditingCategory(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}