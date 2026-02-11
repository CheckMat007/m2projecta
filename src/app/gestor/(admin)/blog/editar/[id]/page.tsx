// src/app/gestor/(admin)/blog/editar/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { PostForm } from '../../_components/PostForm';
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
    <div className="space-y-2">
      
      {/* Passa todos os dados necessários para o formulário */}
      <PostForm post={post} allCategories={allCategories} allTags={allTags} />
    </div>
  );
}