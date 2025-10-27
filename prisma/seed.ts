// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const permissions = [
    { name: 'manage_site', description: 'Acesso a Gerenciar Site (Início, Sobre, etc.)' },
    { name: 'manage_clients', description: 'Acesso a Gerenciar Clientes' },
    { name: 'manage_projects', description: 'Acesso a Gerenciar Projetos' },
    { name: 'manage_portfolio', description: 'Acesso a Gerenciar Portfólio' },
    { name: 'manage_contracts', description: 'Acesso a Gerenciar Contratos' },
    { name: 'manage_team', description: 'Acesso a Gerenciar Equipe' },
    { name: 'manage_blog', description: 'Acesso a Gerenciar Blog' }, // <-- ADICIONADO
    { name: 'send_notifications', description: 'Pode enviar notificações manuais para a equipe' }, // <-- ADICIONADO
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });