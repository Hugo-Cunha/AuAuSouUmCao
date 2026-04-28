import { PrismaClient, EstadoReserva } from '@prisma/client';

const prisma = new PrismaClient();

export class ReservaDAO {
  
  // Vai buscar todas as reservas (Usado pela Receção para listar e faturar)
  async findAll() {
    return await prisma.reserva.findMany({
      include: {
        animal: {
          include: {
            tutor: { include: { utilizador: true } },
            planoVacinal: true
          }
        },
        box: true,
        servicos: true,
        fatura: true
      },
      orderBy: { dataEntrada: 'desc' }
    });
  }

  // Verifica se o animal já está hospedado ou tem reserva marcada
  async findReservaAtivaDoAnimal(idAnimal: string) {
    return await prisma.reserva.findFirst({
      where: {
        animalId: idAnimal,
        estado: { in: ['Pendente', 'CheckIn'] }
      }
    });
  }

  // A BASE PARA IMPEDIR OVERBOOKING: Procura reservas que se cruzam com as datas pedidas
  async findReservasNoPeriodo(entrada: Date, saida: Date) {
    return await prisma.reserva.findMany({
      where: {
        estado: { in: ['Pendente', 'CheckIn'] },
        AND: [
          { dataEntrada: { lt: saida } },
          { dataSaida: { gt: entrada } }
        ]
      }
    });
  }

  // Traz a lista de todas as boxes (Para o sistema saber a lotação máxima)
  async findAllBoxes() {
    return await prisma.box.findMany();
  }

  // Grava a nova reserva e os serviços extra de uma só vez
  async create(dadosReserva: any, servicosAdicionais: any[]) {
    return await prisma.reserva.create({
      data: {
        ...dadosReserva,
        servicos: servicosAdicionais.length > 0 ? {
          create: servicosAdicionais
        } : undefined
      },
      include: { animal: true, box: true, servicos: true }
    });
  }

  // Atualiza o estado (Pendente -> CheckIn -> CheckOut ou Cancelada)
  async updateEstado(idReserva: string, novoEstado: EstadoReserva) {
    return await prisma.reserva.update({
      where: { idReserva },
      data: { estado: novoEstado }
    });
  }

  // Apaga a reserva da base de dados
  async delete(idReserva: string) {
    // Primeiro apaga os serviços ligados para não dar erro de Chave Estrangeira
    await prisma.servico.deleteMany({ where: { reservaId: idReserva } });
    return await prisma.reserva.delete({ where: { idReserva } });
  }
}