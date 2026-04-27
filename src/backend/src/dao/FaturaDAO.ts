import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FaturaDAO {
  async create(dadosFatura: { nifCliente: string, valorTotal: number, documento: string }) {
    return await prisma.faturas.create({
      data: dadosFatura
    });
  }
}