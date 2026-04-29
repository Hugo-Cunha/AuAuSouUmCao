"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestReservasFacade = void 0;
const ReservaDAO_1 = require("../dao/ReservaDAO");
const AnimalDAO_1 = require("../dao/AnimalDAO");
class GestReservasFacade {
    reservaDAO;
    animalDAO;
    constructor() {
        this.reservaDAO = new ReservaDAO_1.ReservaDAO();
        this.animalDAO = new AnimalDAO_1.AnimalDAO();
    }
    // ==========================================
    // REGRAS DE NEGÓCIO: RESERVAS E OVERBOOKING
    // ==========================================
    async criarReserva(dadosReserva, servicos) {
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
    async confirmarCheckIn(idReserva) {
        return await this.reservaDAO.updateEstado(idReserva, 'CheckIn');
    }
    async confirmarCheckOut(idReserva) {
        return await this.reservaDAO.updateEstado(idReserva, 'CheckOut');
    }
    async cancelarReserva(idReserva) {
        return await this.reservaDAO.updateEstado(idReserva, 'Cancelada');
    }
    async eliminarReserva(idReserva) {
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
    async marcarTarefaConcluida(idServico) {
        return await this.reservaDAO.marcarConcluida(idServico);
    }
    async obterServicosFinalizadosHoje(idAnimal) {
        return await this.reservaDAO.findFinalizadosPorAnimalEDia(idAnimal);
    }
}
exports.GestReservasFacade = GestReservasFacade;
