// src/app/(main)/contato/page.tsx
import { prisma } from '@/lib/prisma';
import ContactClientPage from './contact-client';
import type { Metadata } from "next";

const pageTitle = 'Fale Conosco';
const pageDescription = 'Solicite um orçamento para imagens aéreas com drone: inspeções, imóveis, eventos e vídeos corporativos no Vale do Paraíba (SP). Resposta rápida via WhatsApp.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/contato' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/contato',
    type: 'website',
  },
};

export default async function ContatoPage() {
  // Só para preencher o <Select> "Interesse" do formulário — o Header já vem do
  // layout público, então só id/name são necessários aqui (não a linha inteira).
  const services = await prisma.service.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: 'asc' },
  });

  return <ContactClientPage services={services} />;
}