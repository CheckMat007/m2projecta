// src/app/(main)/contato/page.tsx
import { prisma } from '@/lib/prisma';
import ContactClientPage from './contact-client';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Fale Conosco | M2 Projecta',
  description: 'Entre em contato para orçamentos de imagens aéreas e produções audiovisuais.',
};

export default async function ContatoPage() {
  // Busca os serviços no banco para preencher o submenu do Header
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return <ContactClientPage services={services} />;
}