// src/app/(main)/blog/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Post, Category } from '@prisma/client';

type PostCardData = Post & {
  author: { name: string | null };
  categories: Category[];
};

// Função para buscar os dados do blog no servidor
async function getBlogData() {
  // Busca o post em destaque mais recente
  const featuredPost = await prisma.post.findFirst({
    where: { status: 'PUBLISHED', isFeatured: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { take: 1 },
    }
  });

  // Busca os posts mais recentes que NÃO são o destaque
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

  // Busca todas as categorias para os botões de filtro
  const categories = await prisma.category.findMany({
    where: { posts: { some: { status: 'PUBLISHED' } } }
  });

  return { featuredPost, regularPosts, categories };
}

// --- COMPONENTES ATUALIZADOS ---

// Componente para um card de post normal
function PostCard({ post }: { post: PostCardData }) {
    return (
        // REFINAMENTO: O Link agora envolve um 'article' com estilo de card
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
                {/* REFINAMENTO: Adicionado o resumo do post */}
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">{post.seoDescription}</p>
                <p className="text-xs text-gray-500 mt-4">
                    {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
            </div>
        </Link>
    )
}

// Componente para o card de post em destaque
function FeaturedPostCard({ post }: { post: PostCardData }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-m2-green/50 transition-all duration-300">
            <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image 
                    src={post.featuredImageUrl || '/placeholder.jpg'} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            {/* REFINAMENTO: 'items-start' corrige o bug da badge esticada */}
            <div className="flex flex-col gap-2 items-start">
                {post.categories[0] && <Badge variant="secondary">{post.categories[0].name}</Badge>}
                <h2 className="text-3xl md:text-4xl font-bold group-hover:text-m2-green transition-colors">{post.title}</h2>
                {/* REFINAMENTO: Adicionado o resumo do post */}
                <p className="text-gray-400 mt-2 line-clamp-3">{post.seoDescription}</p>
                <p className="text-sm text-gray-500 mt-4">
                    Por {post.author.name} • {post.estimatedReadingTime} min de leitura
                </p>
            </div>
        </Link>
    )
}

// --- PÁGINA PRINCIPAL ---
export default async function BlogListPage() {
  const { featuredPost, regularPosts, categories } = await getBlogData();

  return (
    <>
      {/* --- REFINAMENTO: NOVA HERO SECTION COM IMAGEM DE FUNDO --- */}
      <section className="relative py-20 md:py-32 bg-black hero-image-bg">
        <div className="absolute inset-0">
           
            <div className="absolute inset-0 bg-gradient-to-t from-m2-dark via-black/40 to-black/60 z-0" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
            <h1 className="text-5xl font-bold tracking-tight">BLOG DA <span className="text-m2-green">M2 PROJECTA</span></h1>
            <p className="text-lg text-gray-200 mt-2 max-w-3xl mx-auto">Novidades, tutoriais e insights do mundo dos drones e da produção audiovisual.</p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        {/* Filtros de Categoria e Barra de Busca */}
        <nav className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 flex-wrap mb-16">
            <div className="flex gap-2 flex-wrap justify-center">
                <Link href="/blog" className="px-4 py-2 rounded-full bg-m2-green text-black text-sm font-semibold">Todos</Link>
                {categories.map(category => (
                    <Link key={category.id} href={`/blog/categoria/${category.slug}`} className="px-4 py-2 rounded-full bg-gray-800 hover:bg-m2-green hover:text-black transition-colors text-sm font-semibold">
                        {category.name}
                    </Link>
                ))}
            </div>
            {/* REFINAMENTO: BARRA DE BUSCA */}
            <form action="/blog/busca" method="GET" className="relative w-full max-w-xs">
                <Input type="search" name="q" placeholder="Buscar no blog..." className="pl-10"/>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
            </form>
        </nav>

        {/* Seção de Post em Destaque */}
        {featuredPost && (
          <section className="mb-16">
            <FeaturedPostCard post={featuredPost} />
          </section>
        )}

        {/* Grade de Posts Recentes */}
        {regularPosts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}

        {regularPosts.length === 0 && !featuredPost && (
          <div className="text-center py-16">
              <p className="text-gray-500">Nenhum post publicado ainda. Volte em breve!</p>
          </div>
        )}
      </div>
    </>
  );
}