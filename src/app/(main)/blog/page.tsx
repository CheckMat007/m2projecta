// src/app/(main)/blog/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Rss } from 'lucide-react';
import type { Post, Category } from '@prisma/client';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Blog | M2 Projecta',
  description: 'Fique atualizado sobre notícias e informações importantes sobre drones e imagens aéreas.',
  alternates: { canonical: '/blog' },
};

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// --- DATA FETCHING ---
async function getBlogData() {
  const featuredPost = await prisma.post.findFirst({
    where: { status: 'PUBLISHED', isFeatured: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    }
  });

  const regularPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: featuredPost ? { not: featuredPost.id } : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    },
    take: 6,
  });

  const categories = await prisma.category.findMany({
    where: { posts: { some: { status: 'PUBLISHED' } } },
    orderBy: { name: 'asc' }
  });

  return { featuredPost, regularPosts, categories };
}

// --- COMPONENTES DE UI ---

function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 md:p-8 hover:border-m2-green/30 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green w-full"
    >
      <div className="aspect-[4/3] lg:aspect-video relative overflow-hidden rounded-2xl w-full">
        <Image 
          src={post.featuredImageUrl || '/assets/hero-image.JPG'} 
          alt={post.title} 
          fill 
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105 filter md:grayscale md:group-hover:grayscale-0" 
        />
        <div className="absolute inset-0 bg-m2-green/10 mix-blend-overlay opacity-0 md:group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
      </div>
      
      <div className="flex flex-col items-start p-2 md:p-0">
        <div className="mb-4 overflow-hidden w-full">
          {post.categories[0] && (
            <span className="inline-block text-m2-green text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              {post.categories[0].name}
            </span>
          )}
        </div>
        
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight group-hover:text-m2-green transition-colors duration-300 break-words line-clamp-3">
          {post.title}
        </h2>
        
        <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-lg leading-relaxed line-clamp-3 w-full">
          {post.seoDescription}
        </p>
        
        <div className="flex items-center justify-between mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5 w-full">
          <div>
            <p className="text-white font-bold text-sm md:text-base">{post.author.name || 'Equipe M2'}</p>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              {format(new Date(post.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })} • {post.estimatedReadingTime || 3} min leitura
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-m2-green group-hover:border-m2-green transition-colors duration-300">
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-black transition-colors" aria-hidden="true"/>
          </div>
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-m2-green/30 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
    >
      <div className="aspect-[4/3] relative overflow-hidden w-full shrink-0">
        <Image 
          src={post.featuredImageUrl || '/assets/hero-image.JPG'} 
          alt={post.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105 filter md:grayscale md:group-hover:grayscale-0" 
        />
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-1">
        {post.categories[0] && (
          <span className="text-m2-green text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
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

// --- PÁGINA PRINCIPAL ---
export default async function BlogListPage() {
  const { featuredPost, regularPosts, categories } = await getBlogData();

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#050505] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[40vh] md:min-h-[50vh] flex items-center md:items-end pb-12 md:pb-24 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/portfolio/dutra.JPG" // Substitua por uma imagem conceitual de drone se desejar
            alt="Blog M2 Projecta" 
            fill 
            className="object-cover opacity-40" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
        </div>
        
        {/* pt-28 no mobile para proteger do header fixo */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 pt-28 md:pt-0">
          <div className="max-w-3xl border-l-4 border-m2-green pl-4 md:pl-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight break-words">
              M2 <span className="text-m2-green">BLOG</span>
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
              Perspectivas, tutoriais e insights profundos do universo audiovisual e operações com drones.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTROS E BUSCA (Sticky & Wrap) */}
      <section className="py-6 md:py-8 bg-[#050505] border-b border-white/5 sticky top-[72px] z-[30] backdrop-blur-md bg-[#050505]/90">
        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Categorias (Quebra de linha nativa no mobile) */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 w-full lg:w-auto">
            <Link 
              href="/blog" 
              className="px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-m2-green border border-m2-green text-black text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Todos
            </Link>
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/blog/categoria/${category.slug}`} 
                className="px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-transparent border border-white/10 text-gray-400 text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] hover:border-m2-green hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Busca (Input Premium) */}
          <form action="/blog/busca" method="GET" className="relative w-full lg:max-w-xs shrink-0">
            <Input 
              type="search" 
              name="q" 
              placeholder="Pesquisar artigos..." 
              className="w-full pl-12 py-6 bg-[#111] border-white/10 text-white rounded-xl focus-visible:ring-m2-green focus-visible:ring-offset-0 placeholder:text-gray-500" 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" aria-hidden="true" />
          </form>
        </div>
      </section>
      
      {/* 3. CONTEÚDO DO BLOG */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        
        {/* Post em Destaque */}
        {featuredPost && (
          <section className="mb-16 md:mb-24">
            <FeaturedPostCard post={featuredPost} />
          </section>
        )}

        {/* Grade de Posts Recentes */}
        {regularPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10 md:mb-12">
              <Rss className="w-6 h-6 text-m2-green" aria-hidden="true" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wide">
                Últimas <span className="text-m2-green">Publicações</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Estado Vazio (Sem Posts) */}
        {regularPosts.length === 0 && !featuredPost && (
          <div className="text-center py-24 md:py-32 border border-white/5 rounded-3xl bg-[#111]">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nossa equipe editorial está preparando conteúdos incríveis. Volte em breve!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}