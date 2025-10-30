// src/app/gestor/(admin)/blog/novo/page.tsx
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const PostForm = dynamic(() => 
  import('../_components/PostForm').then(mod => mod.PostForm), 
  { ssr: false }
);

export default async function NewPostPage() {
  // Busca tanto as categorias quanto as tags
  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/gestor/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ChevronLeft size={20} />
          Voltar para a lista de posts
        </Link>
        <h1 className="text-3xl font-bold">Criar Novo Post</h1>
        <p className="text-gray-400">Preencha os campos abaixo para adicionar uma nova postagem ao blog.</p>
      </div>
      {/* Passa ambas as listas para o formulário */}
      <PostForm allCategories={allCategories} allTags={allTags} />
    </div>
  );
}