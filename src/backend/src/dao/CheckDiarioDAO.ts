import { PrismaClient, EstadoClinico } from '@prisma/client';

const prisma = new PrismaClient();

export class CheckDiarioDAO {
  
  // Registra um check diário da veterinária
  async registarCheckDiario(idAnimal: string, notas: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const diarioExistente = await prisma.diarioBordo.findFirst({
      where: {
        animalId: idAnimal,
        timestamp: {
          gte: hoje,
          lt: amanha
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    if (!diarioExistente) {
      throw new Error(`Não foi encontrado nenhum Diário de Bordo registado hoje para o animal com ID: ${idAnimal}`);
    }
    return await prisma.diarioBordo.update({
      where: {
        idRegisto: diarioExistente.idRegisto
      },
      data: {
        descricao: notas 
      }
    });
  }

  // Ativa quarentena para um animal
  async ativarQuarentena(idAnimal: string, motivo: string) {
    // Primeira atualiza o estado do animal para quarentena
    const animalAtualizado = await prisma.animal.update({
      where: { idAnimal },
      data: { estado: 'Quarentena' }
    });

    // Depois registra no diário
    await prisma.diarioBordo.create({
      data: {
        animalId: idAnimal,
        descricao: `🚨 [QUARENTENA] ${motivo}`,
        timestamp: new Date(),
        fotos: []
      }
    });

    return animalAtualizado;
  }

  // Desativa quarentena
  async desativarQuarentena(idAnimal: string) {
    return await prisma.animal.update({
      where: { idAnimal },
      data: { estado: 'Saudavel' }
    });
  }

  // Lista cães em quarentena
  async listarEmQuarentena() {
    return await prisma.animal.findMany({
      where: { estado: 'Quarentena' },
      include: {
        tutor: { include: { utilizador: true } },
        diarioBordo: { orderBy: { timestamp: 'desc' }, take: 5 }
      }
    });
  }

  // Busca cães que estão hospedados (CheckIn) e ainda não foram verificados hoje
  async listarCaesParaVerificar() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Cães hospedados
    const caesHospedados = await prisma.animal.findMany({
      where: {
        reservas: {
          some: {
            estado: 'CheckIn',
            dataEntrada: { lt: amanha },
            dataSaida: { gt: hoje }
          }
        }
      },
      include: {
        tutor: { include: { utilizador: true } },
        reservas: {
          where: {
            estado: 'CheckIn',
            dataEntrada: { lt: amanha },
            dataSaida: { gt: hoje }
          },
          include: { box: true }
        },
        diarioBordo: {
          where: {
            timestamp: { gte: hoje, lt: amanha },
            descricao: { contains: 'CHECK VETERINÁRIO' }
          }
        }
      }
    });

    // Filtra apenas os que ainda não têm check hoje
    return caesHospedados.filter(cao => cao.diarioBordo.length === 0);
  }

  // Verifica se um animal já foi verificado hoje
  async verificarSeJaFoiCheckHoje(idAnimal: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const check = await prisma.diarioBordo.findFirst({
      where: {
        animalId: idAnimal,
        timestamp: { gte: hoje, lt: amanha },
        descricao: { contains: 'CHECK VETERINÁRIO' }
      }
    });

    return !!check;
  }
}
