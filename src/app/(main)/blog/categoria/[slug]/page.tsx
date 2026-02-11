// src/app/(main)/blog/categoria/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, FolderSearch } from 'lucide-react';
import type { Post, Category } from '@prisma/client';
import type { Metadata } from 'next';

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// --- 1. SEO DINÂMICO PARA A CATEGORIA ---
export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true }
  });

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: `${category.name} | Blog M2 Projecta`,
    description: `Navegue por todos os artigos e novidades sobre ${category.name} no blog da M2 Projecta.`,
  };
}

// --- 2. COMPONENTE DE CARD SINCRONIZADO ---
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

// --- 3. BUSCA DE DADOS ---
async function getCategoryData(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { category: null, posts: [] };
  }

  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      categories: {
        some: { slug },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    },
  });

  return { category, posts };
}

// --- 4. PÁGINA PRINCIPAL ---
export default async function CategoryArchivePage({ params }: { params: { slug: string } }) {
  const { category, posts } = await getCategoryData(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#050505] min-h-screen">
      
      {/* HEADER DA CATEGORIA */}
      <section className="relative w-full pt-32 pb-16 md:pt-48 md:pb-24 bg-black overflow-hidden flex items-center justify-center text-center">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-m2-green/10 blur-[120px] md:blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-m2-green transition-colors font-medium mb-6 md:mb-8 text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm px-2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Voltar para o Blog
            </Link>
            
            <p className="text-m2-green font-bold uppercase tracking-[0.2em] mb-4 text-xs md:text-sm">
              Navegando na Categoria
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight break-words max-w-4xl">
              {category.name}
            </h1>
            <p className="mt-4 md:mt-6 text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Exibindo todos os {posts.length} artigos publicados sobre este assunto.
            </p>
          </div>
        </div>
      </section>

      {/* CONTEÚDO (Grid de Posts) */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          /* ESTADO VAZIO */
          <div className="text-center py-20 md:py-32 border border-white/5 rounded-3xl bg-[#111] max-w-3xl mx-auto">
            <FolderSearch className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4 md:mb-6" aria-hidden="true" />
            <h3 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">Categoria Vazia</h3>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto px-4">
              Nenhum artigo foi publicado em &quot;{category.name}&quot; recentemente. Explore outras categorias no nosso blog.
            </p>
            <div className="mt-8">
              <Link 
                href="/blog" 
                className="bg-transparent border-2 border-m2-green text-m2-green font-bold uppercase tracking-wider py-3 px-8 md:py-4 md:px-10 rounded-xl text-sm hover:bg-m2-green hover:text-black transition-all duration-300 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green focus-visible:ring-offset-4 focus-visible:ring-offset-[#111]"
              >
                Voltar para o Início
              </Link>
            </div>
          </div>
        )}
      </section>
      
    </div>
  );
}