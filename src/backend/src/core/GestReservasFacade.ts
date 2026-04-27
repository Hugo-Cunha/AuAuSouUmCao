import { ReservaDAO } from '../dao/ReservaDAO';
import { AnimalDAO } from '../dao/AnimalDAO';
import { EstadoReserva } from '@prisma/client';

export class GestReservasFacade {
  private reservaDAO: ReservaDAO;
  private animalDAO: AnimalDAO;

  constructor() {
    this.reservaDAO = new ReservaDAO();
    this.animalDAO = new AnimalDAO();
  }

  // ==========================================
  // REGRAS DE NEGÓCIO: RESERVAS E OVERBOOKING
  // ==========================================

  async criarReserva(dadosReserva: any, servicos: any[]) {
    const { dataEntrada, dataSaida, animalId, boxNumero } = dadosReserva;
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);

    // Regra 1: Validação de Datas
    if (isNaN(entrada.getTime()) || isNaN(saida.getTime()) || saida <= entrada) {
      throw new Error("Datas inválidas. A data de saída deve ser posterior à entrada.");
    }

    // Regra 2: Validar se o animal existe
    const animalExiste = await this.animalDAO.findByIdWithHistorial(animalId);
    if (!animalExiste) {
      throw new Error("Animal não encontrado na base de dados.");
    }

    // Regra 3: Um animal não pode ter duas reservas ativas ao mesmo tempo
    const reservaAtiva = await this.reservaDAO.findReservaAtivaDoAnimal(animalId);
    if (reservaAtiva) {
      throw new Error(`Este animal já possui uma reserva ativa (${reservaAtiva.estado}).`);
    }

    // Regra 4: CONTROLO DE OVERBOOKING (US01 / US02)
    const boxDesejada = boxNumero || 1;
    const reservasConflituosas = await this.reservaDAO.findReservasNoPeriodo(entrada, saida);
    
    const boxEstaOcupada = reservasConflituosas.some(r => r.boxNumero === boxDesejada);
    
    if (boxEstaOcupada) {
      // Se a box desejada estiver ocupada, procuramos as boxes livres
      const todasBoxes = await this.reservaDAO.findAllBoxes();
      const boxesOcupadasIds = reservasConflituosas.map(r => r.boxNumero);
      const boxesLivres = todasBoxes.filter(b => !boxesOcupadasIds.includes(b.numero));

      if (boxesLivres.length === 0) {
        throw new Error("OVERBOOKING: O hotel está completamente lotado para estas datas.");
      } else {
        throw new Error(`A Box ${boxDesejada} está ocupada. Boxes livres: ${boxesLivres.map(b => b.numero).join(', ')}`);
      }
    }

    // Se passou em todas as regras de segurança, mandamos o DAO gravar
    dadosReserva.estado = 'Pendente';
    dadosReserva.dataEntrada = entrada;
    dadosReserva.dataSaida = saida;
    
    return await this.reservaDAO.create(dadosReserva, servicos);
  }

  async listarTodas() {
    return await this.reservaDAO.findAll();
  }

  async confirmarCheckIn(idReserva: string) {
    return await this.reservaDAO.updateEstado(idReserva, 'CheckIn');
  }

  async confirmarCheckOut(idReserva: string) {
    return await this.reservaDAO.updateEstado(idReserva, 'CheckOut');
  }

  async cancelarReserva(idReserva: string) {
    return await this.reservaDAO.updateEstado(idReserva, 'Cancelada');
  }

  async eliminarReserva(idReserva: string) {
    return await this.reservaDAO.delete(idReserva);
  }
}