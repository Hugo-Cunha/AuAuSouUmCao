import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UtilizadorDAO {
  
  // Procura um utilizador pelo Email (usado no Login e no Registo)
  async findByEmail(email: string) {
    return await prisma.utilizador.findFirst({
      where: { email: email },
      include: {
        tutor: true,
        funcionario: true
      }
    });
  }

  // Cria um novo Utilizador que é Tutor (usado no Registo)
  async createTutor(nome: string, email: string, passwordHash: string, nif: string, telemovel: string) {
    return await prisma.utilizador.create({
      data: {
        nome: nome,
        email: email,
        password: passwordHash,
        tutor: {
          create: {
            nif: nif,
            contacto: telemovel 
          }
        }
      }
    });
  }
}