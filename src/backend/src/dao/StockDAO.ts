import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StockDAO {
  async findAll() {
    return await prisma.stock.findMany({ include: { medicamento: true } });
  }

  async updateQuantidade(idItem: string, novaQuantidade: number) {
    return await prisma.stock.update({
      where: { idItem },
      data: { quantidade: novaQuantidade }
    });
  }
}