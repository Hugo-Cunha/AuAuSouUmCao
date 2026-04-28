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
    const { dataEntrada, dataSaida, animalId } = dadosReserva;
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

    // Regra 4: ATRIBUIÇÃO AUTOMÁTICA DE BOX (com regra de reativos/não-reativos)
    const reatividade = animalExiste.reatividade || 'Não Reativo';
    const boxAtribuida = await this.reservaDAO.atribuirBoxAutomaticamente(reatividade, entrada, saida);

    // Cálculo do valor total da reserva
    const dias = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24);
    const precoEstadia = dias * 20; // 20€ por dia
    const precoServicos = servicos.reduce((acc, s) => acc + (s.preco || 0), 0);
    const valorTotal = precoEstadia + precoServicos;

    // Se passou em todas as regras de segurança, mandamos o DAO gravar
    dadosReserva.estado = 'Pendente';
    dadosReserva.dataEntrada = entrada;
    dadosReserva.dataSaida = saida;
    dadosReserva.boxNumero = boxAtribuida; // ← BOX ATRIBUÍDA AUTOMATICAMENTE
    dadosReserva.valor = valorTotal; // ← VALOR CALCULADO
    
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

    // ==========================================
  // GESTÃO DE TAREFAS (STAFF)
  // ==========================================
  async listarTarefasDoDia() {
    return await this.reservaDAO.findTarefasDoDia();
  }

  async listarTarefasPendentes() {
    return await this.reservaDAO.findTarefasPendentes();
  }

  async marcarTarefaConcluida(idServico: string) {
    return await this.reservaDAO.marcarConcluida(idServico);
  }

  async obterServicosFinalizadosHoje(idAnimal: string) {
    return await this.reservaDAO.findFinalizadosPorAnimalEDia(idAnimal);
  }
}