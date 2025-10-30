// src/app/(main)/blog/busca/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
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
        <Link href={`/blog/${post.slug}`} className="group block bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-m2-green/50 transition-all duration-300">
            <div className="aspect-video relative overflow-hidden">
                <Image 
                    src={post.featuredImageUrl || '/placeholder.jpg'} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-6">
                {post.categories[0] && <Badge variant="secondary">{post.categories[0].name}</Badge>}
                <h3 className="text-xl font-bold mt-2 group-hover:text-m2-green transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">{post.seoDescription}</p>
                <p className="text-xs text-gray-500 mt-4">
                    {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
            </div>
        </Link>
    )
}

// Função para buscar os resultados da pesquisa no servidor
async function getSearchResults(query: string) {
  // A lógica principal: busca posts publicados onde o 'query' aparece
  // no título, no conteúdo, ou na descrição de SEO.
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { seoDescription: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    },
  });

  return posts;
}

// A página recebe 'searchParams' como prop, que contém os parâmetros da URL (ex: ?q=drone)
export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: { q: string | undefined } 
}) {
  const query = searchParams.q;

  // Se não houver termo de busca, redireciona para a página principal do blog
  if (!query) {
    redirect('/blog');
  }

  const posts = await getSearchResults(query);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <p className="text-m2-green font-semibold mb-2">Resultados da Busca</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Você buscou por: &quot;{query}&quot;
        </h1>
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white mt-4 inline-block">
            ← Voltar para todos os posts
        </Link>
      </header>

      {/* Grade de Resultados */}
      {posts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </section>
      ) : (
        <div className="text-center py-16">
            <p className="text-2xl font-semibold">Nenhum resultado encontrado</p>
            <p className="text-gray-500 mt-2">Tente buscar por um termo diferente.</p>
        </div>
      )}
    </div>
  );
}