import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DiarioBordoDAO {
  async create(descricao: string, animalId: string, fotos: string[] = []) {
    return await prisma.diarioBordo.create({
      data: {
        descricao,
        animalId,
        fotos
      }
    });
  }

  
}