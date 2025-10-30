// src/app/gestor/(admin)/blog/tags/_components/TagsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Tag } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { createTagAction, updateTagAction, deleteTagAction } from '../actions';

function TagForm({ tag, onFormSubmit }: { tag?: Tag, onFormSubmit: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!tag;

  const handleSubmit = async (formData: FormData) => {
    const action = isEditing ? updateTagAction : createTagAction;
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
      {isEditing && <input type="hidden" name="tagId" value={tag.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Tag</Label>
        <Input id="name" name="name" defaultValue={tag?.name || ''} required className="bg-gray-800 border-gray-700" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Tag'}</Button>
      </DialogFooter>
    </form>
  );
}

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
    <>
      <div className="text-right">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
              <PlusCircle size={18} className="mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Tag</DialogTitle></DialogHeader>
            <TagForm onFormSubmit={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader><TableRow className="border-gray-800"><TableHead>Nome</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialTags.map((tag) => (
              <TableRow key={tag.id} className="border-gray-800">
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingTag(tag)}><Edit size={16} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 size={16} /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Posts com esta tag não serão deletados.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(tag.id)}>Deletar</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingTag} onOpenChange={(isOpen) => !isOpen && setEditingTag(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Tag</DialogTitle></DialogHeader>
          {editingTag && <TagForm tag={editingTag} onFormSubmit={() => setEditingTag(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}