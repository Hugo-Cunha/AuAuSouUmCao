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

  async animalDiario(idAnimal: string) {
    const animal = await prisma.animal.findUnique({
      where: { idAnimal },
      include: {
        diarioBordo: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!animal) {
      return { error: 'Animal não encontrado na base de dados.' };
    }

    const reservaAnimal = await prisma.reserva.findFirst({
      where: { animalId: idAnimal},
      include: {
        servicos: {
          orderBy: { data: 'asc' }
        }
      }
    })

    return {
      idAnimal: animal.idAnimal,
      nome: animal.nome,
      estadoClinico: animal.estado,
      diarioBordo: animal.diarioBordo.map((registo: any) => ({
        dataHora: registo.timestamp,
        descricao: registo.descricao,
        fotoUrl: registo.fotos[0] || ''
      })),
      servicos: reservaAnimal?.servicos
    };
  }

  // Atualiza o plano vacinal de um animal
  async updatePlanoVacinal(idAnimal: string, dadosVacina: any) {
    // Primeiro verifica se o animal existe
    const animal = await prisma.animal.findUnique({
      where: { idAnimal },
      include: { planoVacinal: true }
    });

    if (!animal) {
      throw new Error(`Animal com ID ${idAnimal} não encontrado.`);
    }

    // Se já tem plano vacinal, atualiza. Se não, cria.
    if (animal.planoVacinal) {
      return await prisma.planoVacinal.update({
        where: { idPlano: animal.planoVacinal.idPlano },
        data: dadosVacina
      });
    } else {
      return await prisma.planoVacinal.create({
        data: {
          ...dadosVacina,
          animalId: idAnimal
        }
      });
    }
  }

  // Busca o historial completo do animal (diário + servicos)
  async findHistorialComDados(idAnimal: string) {
    const animal = await prisma.animal.findUnique({
      where: { idAnimal },
      include: {
        diarioBordo: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!animal) {
      throw new Error(`Animal com ID ${idAnimal} não encontrado.`);
    }

    return {
      idAnimal: animal.idAnimal,
      nome: animal.nome,
      raca: animal.raca,
      reatividade: animal.reatividade,
      estadoClinico: animal.estado,
      diarioBordo: animal.diarioBordo.map(d => ({
        dataHora: d.timestamp,
        descricao: d.descricao
      }))
    };
  }
}