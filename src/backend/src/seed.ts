import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 A atualizar contas com passwords encriptadas...');

  const saltRounds = 10;
  const hashedPass = await bcrypt.hash('password123', saltRounds);

  // 1. Diana (Admin)
  await prisma.utilizador.upsert({
    where: { email: 'diana@auau.pt' },
    update: { password: hashedPass },
    create: {
      nome: 'Diana Silva',
      email: 'diana@auau.pt',
      password: hashedPass,
      funcionario: { create: { perfil: 'Admin' } }
    }
  });

  // 2. Dr. Carlos (Vet)
  await prisma.utilizador.upsert({
    where: { email: 'vet@auau.pt' },
    update: { password: hashedPass },
    create: {
      nome: 'Dr. Carlos',
      email: 'vet@auau.pt',
      password: hashedPass,
      funcionario: { create: { perfil: 'Vet' } }
    }
  });

  // 3. João (Staff)
  await prisma.utilizador.upsert({
    where: { email: 'staff@auau.pt' },
    update: { password: hashedPass },
    create: {
      nome: 'João Cuidador',
      email: 'staff@auau.pt',
      password: hashedPass,
      funcionario: { create: { perfil: 'Staff' } }
    }
  });

  // 4. Marta (Receção)
  await prisma.utilizador.upsert({
    where: { email: 'rececao@auau.pt' },
    update: { password: hashedPass },
    create: {
      nome: 'Marta Rececionista',
      email: 'rececao@auau.pt',
      password: hashedPass,
      funcionario: { create: { perfil: 'Rececao' } }
    }
  });

  // 5. Garantir que a Box 1 existe
  await prisma.box.upsert({
    where: { numero: 1 },
    update: {},
    create: {
      numero: 1,
      tamanho: 2,
      ocupacao: 0,
      estado: 'Higienizada'
    }
  });

  console.log('✅ Base de Dados atualizada e segura!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());