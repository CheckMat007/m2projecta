// src/app/(main)/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { PostInteraction } from '../_components/PostInteraction';
import { cookies } from 'next/headers';
import type { Post, Category } from '@prisma/client';

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// Componente reutilizado
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
                <h3 className="text-lg font-bold mt-2 group-hover:text-m2-green transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
            </div>
        </Link>
    )
}

// Função de busca de dados, simplificada para remover os comentários
async function getPostDetails(slug: string) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();

  const userId = session?.user?.id;
  const voterId = cookieStore.get('voter_id')?.value;

  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: true,
      categories: true,
      tags: true,
      // Busca o voto do usuário atual, seja ele logado (pelo userId) ou anônimo (pelo voterId)
      votes: {
        where: userId ? { userId } : (voterId ? { voterId } : undefined),
      },
    }
  });

  if (!post) {
    return { post: null, relatedPosts: [], likes: 0, dislikes: 0, userVote: null };
  }

  // A contagem de votos é mantida
  const voteCounts = await prisma.postVote.groupBy({
    by: ['type'],
    where: { postId: post.id },
    _count: { _all: true },
  });
  
  const likes = voteCounts.find(v => v.type === 'LIKE')?._count._all || 0;
  const dislikes = voteCounts.find(v => v.type === 'DISLIKE')?._count._all || 0;
  const userVote = post.votes.length > 0 ? post.votes[0].type : null;

  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: post.id },
      categories: { some: { id: { in: post.categories.map(c => c.id) } } }
    },
    include: {
        author: { select: { name: true } },
        categories: { take: 1 },
    },
    take: 3,
  });

return { post, relatedPosts, likes, dislikes, userVote };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { post, relatedPosts, likes, dislikes, userVote } = await getPostDetails(params.slug);

  if (!post) {
    notFound();
  }

  const showUpdatedAt = post.updatedAt.getTime() - post.createdAt.getTime() > 1000 * 60 * 5;

  return (
    <article className="container mx-auto px-4 pt-24 pb-12">
      {/* --- HERO SECTION --- */}
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex justify-center gap-2 mb-4">
            {post.categories.map(category => (
                <Link key={category.id} href={`/blog/categoria/${category.slug}`}>
                    <Badge variant="secondary">{category.name}</Badge>
                </Link>
            ))}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{post.title}</h1>
        <div className="mt-6 text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2">
          <span>Por {post.author.name}</span>
          <span className="hidden sm:inline">•</span>
          <time dateTime={post.createdAt.toISOString()}>
            Publicado em {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </time>
          <span className="hidden sm:inline">•</span>
          <span>{post.estimatedReadingTime} min de leitura</span>
        </div>
        
        {showUpdatedAt && (
          <div className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <Clock size={12} />
            <span>Atualizado em {format(new Date(post.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
          </div>
        )}
      </header>
      
      <div className="max-w-5xl mx-auto aspect-video relative overflow-hidden rounded-lg mb-12">
        <Image 
          src={post.featuredImageUrl || '/placeholder.jpg'} 
          alt={post.featuredImageAlt || post.title}
          fill 
          className="object-cover"
        />
        {post.featuredImageSource && (
          <p className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            Fonte: {post.featuredImageSource}
          </p>
        )}
      </div>

      {/* --- LAYOUT DE DUAS COLUNAS --- */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Coluna Principal: Conteúdo do Post */}
        <div className="lg:col-span-2">
            <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* A seção de interação (votos) foi mantida */}
            <div className="mt-8 pt-8 border-t border-gray-800">
                <PostInteraction 
                   postId={post.id}
                   initialLikes={likes}
                   initialDislikes={dislikes}
                   userVote={userVote}
                 />
            </div>

            {post.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="font-semibold mb-2">Tags:</h4>
                    <div className="flex gap-2 flex-wrap">
                        {post.tags.map(tag => (
                            <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                                <Badge variant="outline">#{tag.name}</Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar Estratégica */}
        <aside className="lg:col-span-1 space-y-8 self-start sticky top-24">
            
            {post.author.showOnAboutPage ? (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 text-center">
                    <Image src={post.author.image || '/avatar-placeholder.png'} alt={post.author.name || ''} width={80} height={80} className="rounded-full mx-auto mb-4" />
                    <h4 className="font-bold text-lg">{post.author.name}</h4>
                    <p className="text-sm text-gray-400">{post.author.jobDescription}</p>
                    {post.author.personalQuote && <p className="text-xs text-gray-500 italic mt-2">&quot;{post.author.personalQuote}&quot;</p>}
                </div>
            ) : null }

            <div className="bg-m2-green/10 p-6 rounded-lg border border-m2-green/30 text-center">
                <h4 className="font-bold text-lg text-white">Pronto para Elevar seu Projeto?</h4>
                <p className="text-sm text-gray-300 mt-2 mb-4">Vamos conversar sobre como nossas imagens aéreas podem transformar sua visão.</p>
                <Link href="/contato" className="inline-block px-6 py-3 rounded-md bg-m2-green text-black font-semibold hover:bg-opacity-80 transition-colors">
                    Solicite um Orçamento
                </Link>
            </div>
        </aside>
      </div>

      {/* --- SEÇÃO DE POSTS RELACIONADOS --- */}
      {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto mt-8 pt-12 border-t border-gray-800">
              <h2 className="text-3xl font-bold mb-8 text-center">Posts Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map(related => (
                      <PostCard key={related.id} post={related} />
                  ))}
              </div>
          </section>
      )}
    </article>
  );
}