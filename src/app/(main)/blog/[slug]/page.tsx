// src/app/(main)/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { PostInteraction } from '../_components/PostInteraction';
import { cookies } from 'next/headers';
import type { Post, Category } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// --- 1. SEO DINÂMICO DO POST ---
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, seoDescription: true, featuredImageUrl: true, seoTitle: true }
  });

  if (!post) return { title: "Artigo não encontrado" };

  const previousImages = (await parent).openGraph?.images || [];
  const pageTitle = post.seoTitle || `${post.title} | M2 Projecta`;

  return {
    title: pageTitle,
    description: post.seoDescription,
    openGraph: {
      title: pageTitle,
      description: post.seoDescription || undefined,
      images: [post.featuredImageUrl || '', ...previousImages],
      type: 'article'
    },
  };
}

// --- 2. CARD SINCRONIZADO (POSTS RELACIONADOS) ---
function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-m2-green/30 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
    >
      <div className="aspect-[4/3] relative overflow-hidden w-full shrink-0 bg-[#111]">
        <Image 
          src={post.featuredImageUrl || '/assets/hero-image.JPG'} 
          alt={post.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 filter md:grayscale md:group-hover:grayscale-0" 
        />
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-1">
        {post.categories[0] && (
          <span className="text-m2-green text-[10px] font-bold uppercase tracking-[0.2em] mb-3 inline-block">
            {post.categories[0].name}
          </span>
        )}
        
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight group-hover:text-m2-green transition-colors duration-300 line-clamp-3 break-words">
          {post.title}
        </h3>
        
        <p className="text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3 flex-1 w-full">
          {post.seoDescription}
        </p>
        
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between w-full">
          <p className="text-gray-500 text-xs">
            {format(new Date(post.createdAt), "dd MMM, yyyy", { locale: ptBR })}
          </p>
          <span className="text-m2-green text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300">
            Ler Artigo <ArrowRight className="w-3 h-3 md:w-4 md:h-4" aria-hidden="true"/>
          </span>
        </div>
      </div>
    </Link>
  )
}

// --- 3. BUSCA DE DADOS ---
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
      votes: {
        where: userId ? { userId } : (voterId ? { voterId } : undefined),
      },
    }
  });

  if (!post) return { post: null, relatedPosts: [], likes: 0, dislikes: 0, userVote: null };

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

// --- 4. PÁGINA DE LEITURA ---
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { post, relatedPosts, likes, dislikes, userVote } = await getPostDetails(params.slug);

  if (!post) {
    notFound();
  }

  const showUpdatedAt = post.updatedAt.getTime() - post.createdAt.getTime() > 1000 * 60 * 5;

  return (
    <article className="w-full max-w-[100vw] overflow-x-hidden bg-[#050505] min-h-screen">
      
      {/* HEADER IMERSIVO (HERO DO ARTIGO) */}
      <header className="relative w-full min-h-[60vh] md:min-h-[80vh] flex flex-col justify-end pb-12 md:pb-24">
        <div className="absolute inset-0 z-0 bg-[#111]">
          {/* CORREÇÃO 1: Imagem agora tem object-center para não desconfigurar */}
          <Image 
            src={post.featuredImageUrl || '/assets/hero-image.JPG'} 
            alt={post.featuredImageAlt || post.title}
            fill 
            sizes="100vw"
            className="object-cover object-center opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 md:px-6 pt-32 md:pt-0">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-m2-green transition-colors font-medium mb-6 md:mb-10 text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar para o Blog
          </Link>

          <div className="max-w-4xl border-l-4 border-m2-green pl-4 md:pl-8">
            
            {/* CORREÇÃO 3: Tags/Categorias agora usam inline-block para não empilharem errado */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
              {post.categories.map(category => (
                <Link key={category.id} href={`/blog/categoria/${category.slug}`} className="inline-block">
                  <span className="inline-block bg-m2-green/10 text-m2-green border border-m2-green/20 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-m2-green hover:text-black transition-colors cursor-pointer leading-none">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight break-words">
              {post.title}
            </h1>
            
            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-y-3 gap-x-4 text-gray-400 text-sm md:text-base font-medium">
              <div className="flex items-center gap-2">
                {/* CORREÇÃO 4: shrink-0 e aspect-square garantem foto redonda sempre */}
                <Image 
                  src={post.author.image || '/avatar-placeholder.png'} 
                  alt={post.author.name || 'Autor'} 
                  width={32} 
                  height={32} 
                  className="rounded-full border border-white/10 object-cover shrink-0 aspect-square"
                />
                <span className="text-white">{post.author.name}</span>
              </div>
              <span className="hidden sm:inline text-white/20">•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {format(new Date(post.createdAt), "dd MMM yyyy", { locale: ptBR })}
              </time>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>{post.estimatedReadingTime} min de leitura</span>
            </div>

            {/* CORREÇÃO 2: A fonte da imagem saiu do 'absolute' e entrou no fluxo do texto para nunca sobrepor */}
            {post.featuredImageSource && (
              <div className="mt-6">
                <span className="inline-block text-[10px] md:text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-md backdrop-blur-sm border border-white/10">
                  📸 Foto por: {post.featuredImageSource}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CORPO DO ARTIGO */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        
        {showUpdatedAt && (
          <div className="max-w-3xl mx-auto mb-8 md:mb-12 flex items-center gap-2 text-xs md:text-sm text-m2-green/80 bg-m2-green/5 p-4 rounded-xl border border-m2-green/10">
            <Clock size={16} className="shrink-0" />
            <span>Este artigo foi atualizado em {format(new Date(post.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} para garantir a precisão das informações.</span>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-invert prose-base md:prose-lg max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-white prose-a:text-m2-green prose-img:rounded-2xl prose-img:shadow-2xl prose-hr:border-white/10 prose-blockquote:border-l-m2-green prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CORREÇÃO 3 (Parte 2): Tags do rodapé arrumadas com inline-block e gap adequado */}
          {post.tags.length > 0 && (
            <div className="mt-16 flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`} className="inline-block">
                  <span className="inline-block text-gray-400 hover:text-white text-xs md:text-sm font-medium bg-[#111] border border-white/10 px-4 py-2 rounded-lg transition-colors cursor-pointer leading-none">
                    #{tag.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/5">
             <PostInteraction 
                postId={post.id}
                initialLikes={likes}
                initialDislikes={dislikes}
                userVote={userVote}
             />
          </div>

          {post.author.showOnAboutPage && (
            <div className="mt-16 p-6 md:p-8 bg-[#111] rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl">
              {/* CORREÇÃO 4 (Parte 2): Imagem do autor do rodapé perfeitamente redonda */}
              <Image 
                src={post.author.image || '/avatar-placeholder.png'} 
                alt={post.author.name || ''} 
                width={80} 
                height={80} 
                className="rounded-full border-2 border-m2-green object-cover shrink-0 aspect-square" 
              />
              <div className="text-center sm:text-left flex-1">
                <h4 className="font-bold text-xl text-white mb-1">{post.author.name}</h4>
                <p className="text-sm font-medium text-m2-green mb-3 uppercase tracking-wider">{post.author.jobDescription}</p>
                {post.author.personalQuote && (
                  <p className="text-gray-400 italic text-sm leading-relaxed">&quot;{post.author.personalQuote}&quot;</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* POSTS RELACIONADOS */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white mb-10 md:mb-12 text-center">
              Continue <span className="text-m2-green">Lendo</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {relatedPosts.map(related => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  );
}