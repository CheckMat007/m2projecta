// src/app/gestor/(admin)/blog/novo/page.tsx
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';


const PostForm = dynamic(() => 
  import('../_components/PostForm').then(mod => mod.PostForm), 
  { ssr: false }
);

export default async function NewPostPage() {
  // Busca tanto as categorias quanto as tags
  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-2">
      
      {/* Passa ambas as listas para o formulário */}
      <PostForm allCategories={allCategories} allTags={allTags} />
    </div>
  );
}