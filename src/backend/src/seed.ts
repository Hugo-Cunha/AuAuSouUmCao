import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('A plantar contas na Base de Dados...');

  // 1. A Diana (Gestora)
  await prisma.utilizador.upsert({
    where: { email: 'diana@auau.pt' },
    update: {},
    create: {
      nome: 'Diana Silva',
      email: 'diana@auau.pt',
      password: 'password123',
      funcionario: { create: { perfil: 'Admin' } }
    }
  });

  // 2. O Veterinário
  await prisma.utilizador.upsert({
    where: { email: 'vet@auau.pt' },
    update: {},
    create: {
      nome: 'Dr. Carlos',
      email: 'vet@auau.pt',
      password: 'password123',
      funcionario: { create: { perfil: 'Vet' } }
    }
  });

  // 3. O Staff (Cuidador)
  await prisma.utilizador.upsert({
    where: { email: 'staff@auau.pt' },
    update: {},
    create: {
      nome: 'João Cuidador',
      email: 'staff@auau.pt',
      password: 'password123',
      funcionario: { create: { perfil: 'Staff' } }
    }
  });

  console.log('Contas criadas com SUCESSO! 🚀');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());