// src/app/(main)/blog/tag/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import type { Post, Category } from '@prisma/client';

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// Componente de Card de Post (reutilizado)
function PostCard({ post }: { post: PostCardData }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
            <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image 
                    src={post.featuredImageUrl || '/placeholder.jpg'} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div>
                {post.categories[0] && <Badge variant="secondary">{post.categories[0].name}</Badge>}
                <h3 className="text-xl font-bold mt-2 group-hover:text-m2-green transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })} • {post.estimatedReadingTime} min de leitura
                </p>
            </div>
        </Link>
    )
}

// Função para buscar os dados da tag e seus posts
async function getTagData(slug: string) {
  // 1. Busca a tag pelo slug
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return { tag: null, posts: [] };
  }

  // 2. Busca todos os posts publicados que pertencem a essa tag
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      tags: {
        some: { slug },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    },
  });

  return { tag, posts };
}

export default async function TagArchivePage({ params }: { params: { slug: string } }) {
  const { tag, posts } = await getTagData(params.slug);

  // Se a tag não for encontrada, exibe uma página 404
  if (!tag) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <p className="text-m2-green font-semibold mb-2">Tag</p>
        <h1 className="text-5xl font-bold tracking-tight">
          #{tag.name}
        </h1>
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white mt-4 inline-block">
            ← Voltar para todos os posts
        </Link>
      </header>

      {/* Grade de Posts */}
      {posts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
            <PostCard key={post.id} post={post} />
            ))}
        </section>
      ) : (
        <div className="text-center py-16">
            <p className="text-gray-500">Nenhum post encontrado com esta tag.</p>
        </div>
      )}
    </div>
  );
}