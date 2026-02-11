'use client';

import Link from 'next/link';
import type { Post } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
// Ícones otimizados (TagIcon substituído por Tag para padrão Lucide atual)
import { Tag, PlusCircle, Edit, Trash2, LayoutGrid, FileText } from 'lucide-react';
import { deletePostAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para os posts que recebemos
type PostWithDetails = Post & {
  author: { name: string | null };
  categories: { name: string }[];
};

export function BlogClientPage({ initialPosts }: { initialPosts: PostWithDetails[] }) {


  const handleDelete = (postId: string) => {
    toast.promise(deletePostAction(postId), {
      loading: 'Deletando post...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        // Opcional: router.refresh() se a server action não revalidar automaticamente
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden">
      
      {/* --- CABEÇALHO E AÇÕES --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gerenciar Blog</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Crie, edite e gerencie suas publicações.
          </p>
        </div>

        {/* Grupo de Ações - Grid no Mobile / Flex no Desktop */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto justify-center">
            <Link href="/gestor/blog/categorias">
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span className="truncate">Categorias</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto justify-center">
            <Link href="/gestor/blog/tags">
              <Tag className="mr-2 h-4 w-4" />
              <span className="truncate">Tags</span>
            </Link>
          </Button>

          {/* Botão Principal - Ocupa toda largura no mobile (col-span-2) */}
          <Button 
            asChild 
            className="col-span-2 sm:w-auto bg-m2-green hover:bg-m2-green/90 text-black font-medium justify-center"
          >
            <Link href="/gestor/blog/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Post
            </Link>
          </Button>
        </div>
      </div>

      {/* --- TABELA --- */}
      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {/* Título ocupa mais espaço */}
              <TableHead className="w-full md:w-[40%]">Postagem</TableHead>
              {/* Status visível sempre, mas com largura fixa */}
              <TableHead className="w-[100px]">Status</TableHead>
              {/* Colunas ocultas em telas menores (hidden md:table-cell) */}
              <TableHead className="hidden md:table-cell">Autor</TableHead>
              <TableHead className="hidden lg:table-cell">Categorias</TableHead>
              <TableHead className="hidden lg:table-cell">Data</TableHead>
              {/* Ações alinhadas à direita */}
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {initialPosts.length > 0 ? (
              initialPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                  
                  {/* CÉLULA 1: Título + Metadados Mobile */}
                  <TableCell className="py-3 align-top md:align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground line-clamp-2 md:line-clamp-1" title={post.title}>
                        {post.title}
                      </span>
                      
                      {/* Metadados visíveis APENAS em Mobile (substituem as colunas ocultas) */}
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground md:hidden">
                        <span>{format(new Date(post.createdAt), "dd/MM/yy")}</span>
                        <span>•</span>
                        <span>{post.author.name?.split(' ')[0] || 'Admin'}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* CÉLULA 2: Status */}
                  <TableCell className="py-3 align-top md:align-middle">
                    <Badge 
                      variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                      className="whitespace-nowrap text-[10px] md:text-xs px-2 py-0.5"
                    >
                      {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>

                  {/* CÉLULAS OCULTAS EM MOBILE (Desktop Only) */}
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {post.author.name || '—'}
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.length > 0 
                        ? post.categories.slice(0, 2).map((c, i) => (
                            <span key={i} className="bg-muted px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                              {c.name}
                            </span>
                          ))
                        : <span className="opacity-50 text-xs">Sem categoria</span>
                      }
                      {post.categories.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{post.categories.length - 2}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {format(new Date(post.createdAt), "dd MMM yyyy", { locale: ptBR })}
                  </TableCell>

                  {/* CÉLULA FINAL: Ações */}
                  <TableCell className="text-right py-3 align-top md:align-middle">
                    <div className="flex items-center justify-end gap-1">
                      {/* Botão Editar - Link para melhor performance e SEO */}
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Link href={`/gestor/blog/editar/${post.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar post</span>
                        </Link>
                      </Button>

                      {/* Botão Deletar com Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir post</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir postagem?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você tem certeza que deseja excluir <strong>&quot;{post.title}&quot;</strong>? 
                              <br />
                              Esta ação é irreversível.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(post.id)}
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
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="bg-muted/50 p-4 rounded-full">
                      <FileText className="h-8 w-8 opacity-60" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Nenhum post encontrado</p>
                      <p className="text-sm">Comece criando sua primeira publicação.</p>
                    </div>
                    <Button asChild className="mt-2 bg-m2-green hover:bg-m2-green/90 text-black">
                      <Link href="/gestor/blog/novo">Criar Post Agora</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}