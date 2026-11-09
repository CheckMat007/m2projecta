import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

type SitemapContent = {
  slug: string;
  updatedAt: Date;
};

type SitemapArchive = {
  slug: string;
  posts: Array<{ updatedAt: Date }>;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, portfolioItems, posts, categories, tags] = await Promise.all([
    prisma.service.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.portfolioItem.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { posts: { some: { status: 'PUBLISHED' } } },
      select: {
        slug: true,
        posts: {
          where: { status: 'PUBLISHED' },
          select: { updatedAt: true },
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      where: { posts: { some: { status: 'PUBLISHED' } } },
      select: {
        slug: true,
        posts: {
          where: { status: 'PUBLISHED' },
          select: { updatedAt: true },
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const staticRoutes = ([
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/sobre', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/servicos', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/portfolio', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/contato', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/termos-e-condicoes', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/politica-de-privacidade', priority: 0.3, changeFrequency: 'yearly' },
  ] as const).map(({ path, ...metadata }) => ({
    url: `${SITE_URL}${path}`,
    ...metadata,
  }));

  return [
    ...staticRoutes,
    ...services.map((service: SitemapContent) => ({
      url: `${SITE_URL}/servicos/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...portfolioItems.map((item: SitemapContent) => ({
      url: `${SITE_URL}/portfolio/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((post: SitemapContent) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...categories.map((category: SitemapArchive) => ({
      url: `${SITE_URL}/blog/categoria/${category.slug}`,
      lastModified: category.posts[0]?.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...tags.map((tag: SitemapArchive) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      lastModified: tag.posts[0]?.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ];
}
