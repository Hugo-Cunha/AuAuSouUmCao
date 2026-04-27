import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnimalDAO {

  // Vai buscar todos os animais (usado pela Receção)
  async findAll() {
    return await prisma.animal.findMany({
      include: { planoVacinal: true }
    });
  }

  // Vai buscar apenas os animais de um Tutor específico
  async findByTutorNif(nif: string) {
    return await prisma.animal.findMany({
      where: { tutorNif: nif },
      include: { planoVacinal: true }
    });
  }

  // Encontra um animal pelo ID e traz o seu Diário de Bordo
  async findByIdWithHistorial(idAnimal: string) {
    return await prisma.animal.findUnique({
      where: { idAnimal: idAnimal },
      include: {
        diarioBordo: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
  }

  // Cria um novo animal na Base de Dados
  async createAnimal(dadosAnimal: any, dadosVacina?: any) {
    return await prisma.animal.create({
      data: {
        ...dadosAnimal,
        planoVacinal: dadosVacina ? { create: dadosVacina } : undefined
      }
    });
  }
}