import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LogsDAO {
  async createLog(funcionarioId: string) {
    return await prisma.logMedicacao.create({
      data: { funcionarioId }
    });
  }
}