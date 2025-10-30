// src/app/gestor/(admin)/blog/editar/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { PostForm } from '../../_components/PostForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getData(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { categories: true, tags: true }
  });

  // Busca ambas as listas de taxonomia
  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return { post, allCategories, allTags };
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { post, allCategories, allTags } = await getData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/gestor/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ChevronLeft size={20} />
          Voltar para a lista de posts
        </Link>
        <h1 className="text-3xl font-bold">Editar Post</h1>
        <p className="text-gray-400">Altere os campos abaixo para atualizar a postagem.</p>
      </div>
      {/* Passa todos os dados necessários para o formulário */}
      <PostForm post={post} allCategories={allCategories} allTags={allTags} />
    </div>
  );
}