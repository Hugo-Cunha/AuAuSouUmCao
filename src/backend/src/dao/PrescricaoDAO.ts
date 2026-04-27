import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrescricaoDAO {
  async create(dados: any) {
    return await prisma.prescricao.create({ data: dados });
  }

  async findByAnimal(animalId: string) {
    return await prisma.prescricao.findMany({ where: { animalId } });
  }
}