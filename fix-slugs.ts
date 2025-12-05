// fix-slugs.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  const services = await prisma.service.findMany();
  
  for (const service of services) {
    const slug = generateSlug(service.name);
    console.log(`Updating service: ${service.name} -> ${slug}`);
    
    await prisma.service.update({
      where: { id: service.id },
      data: { slug },
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());