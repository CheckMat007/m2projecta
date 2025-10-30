// src/app/gestor/(admin)/blog/_components/BlogClientPage.tsx
'use client';


import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Post } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
// A CORREÇÃO: Importar o novo ícone
import { TagIcon, PlusCircle, Edit, Trash2, LayoutGrid } from 'lucide-react';
import { deletePostAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para os posts que recebemos, incluindo as relações
type PostWithDetails = Post & {
  author: { name: string | null };
  categories: { name: string }[];
};

export function BlogClientPage({ initialPosts }: { initialPosts: PostWithDetails[] }) {
  const router = useRouter();

  const handleDelete = (postId: string) => {
    toast.promise(deletePostAction(postId), {
      loading: 'Deletando post...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
          <p className="text-gray-400">Crie e edite as postagens do seu blog.</p>
        </div>

        {/* --- A CORREÇÃO PRINCIPAL ESTÁ AQUI --- */}
        {/* Agrupamos os botões de ação para melhor organização */}
        <div className="flex items-center gap-2">
          <Button 
            asChild
            variant="outline" // Estilo secundário
          >
            <Link href="/gestor/blog/categorias">
              <LayoutGrid size={18} className="mr-2" />
              Gerenciar Categorias
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/gestor/blog/tags">
              <TagIcon size={18} className="mr-2" />
              Gerenciar Tags
            </Link>
          </Button>

          <Button 
            asChild // Permite que o Button se comporte como um Link
            className="bg-m2-green/90 text-black hover:bg-m2-green"
          >
            <Link href="/gestor/blog/novo">
              <PlusCircle size={18} className="mr-2" />
              Criar Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900/50">
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts.map((post) => (
              <TableRow key={post.id} className="border-gray-800">
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </TableCell>
                <TableCell>{post.author.name || 'N/A'}</TableCell>
                <TableCell className="text-xs text-gray-400">
                  {post.categories.map(c => c.name).join(', ')}
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {format(new Date(post.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => router.push(`/gestor/blog/editar/${post.id}`)}
                  >
                    <Edit size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon"><Trash2 size={16} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita e irá deletar o post permanentemente.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialPosts.length === 0 && (
          <p className="text-center text-gray-500 p-8">Nenhum post encontrado. Que tal criar o primeiro?</p>
        )}
      </div>
    </div>
  );
}