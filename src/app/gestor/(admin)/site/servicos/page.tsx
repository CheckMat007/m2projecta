// src/app/gestor/(admin)/site/servicos/page.tsx
import { prisma } from "@/lib/prisma";
import { ServicesClientPage } from "./_components/ServicesClientPage";

// Busca os dados no servidor
async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return services;
}

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <ServicesClientPage initialServices={services} />
  );
}