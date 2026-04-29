"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorHotelFacade = void 0;
const GestHospedesFacade_1 = require("./GestHospedesFacade");
const GestReservasFacade_1 = require("./GestReservasFacade");
const GestOperacoesFacade_1 = require("./GestOperacoesFacade");
const GestFaturacaoFacade_1 = require("./GestFaturacaoFacade");
const GestClinicaFacade_1 = require("./GestClinicaFacade");
class GestorHotelFacade {
    gestHospedes;
    gestReservas;
    gestOperacoes;
    gestFaturacao;
    gestClinica;
    constructor() {
        this.gestHospedes = new GestHospedesFacade_1.GestHospedesFacade();
        this.gestReservas = new GestReservasFacade_1.GestReservasFacade();
        this.gestOperacoes = new GestOperacoesFacade_1.GestOperacoesFacade();
        this.gestFaturacao = new GestFaturacaoFacade_1.GestFaturacaoFacade();
        this.gestClinica = new GestClinicaFacade_1.GestClinicaFacade();
    }
    // ==========================================
    // DELEGAÇÃO: HÓSPEDES E CONTAS
    // ==========================================
    async criarConta(nome, email, passwordHash, nif, telemovel) {
        return await this.gestHospedes.criarContaTutor(nome, email, passwordHash, nif, telemovel);
    }
    async buscarUtilizador(email) {
        return await this.gestHospedes.buscarUtilizadorPorEmail(email);
    }
    async registarAnimal(dadosAnimal, dadosVacina) {
        return await this.gestHospedes.registarAnimal(dadosAnimal, dadosVacina);
    }
    async listarAnimais() {
        return await this.gestHospedes.listarTodosAnimais();
    }
    async listarAnimaisTutor(nif) {
        return await this.gestHospedes.listarAnimaisTutor(nif);
    }
    async atualizarPlanoVacinal(idAnimal, dadosVacina) {
        return await this.gestHospedes.atualizarPlanoVacinal(idAnimal, dadosVacina);
    }
    async obterHistorialAnimal(idAnimal) {
        return await this.gestHospedes.obterHistorialAnimal(idAnimal);
    }
    async obterServicosFinalizadosHoje(idAnimal) {
        return await this.gestReservas.obterServicosFinalizadosHoje(idAnimal);
    }
    // ==========================================
    // DELEGAÇÃO: RESERVAS
    // ==========================================
    async efetuarReserva(dadosReserva, servicos) {
        return await this.gestReservas.criarReserva(dadosReserva, servicos);
    }
    async listarReservas() {
        return await this.gestReservas.listarTodas();
    }
    async checkIn(idReserva) {
        return await this.gestReservas.confirmarCheckIn(idReserva);
    }
    async checkOut(idReserva) {
        // Orquestração: Ao fazer check-out, podemos já chamar a faturação no futuro!
        return await this.gestReservas.confirmarCheckOut(idReserva);
    }
    async cancelarReserva(idReserva) {
        return await this.gestReservas.cancelarReserva(idReserva);
    }
    async apagarReserva(idReserva) {
        return await this.gestReservas.eliminarReserva(idReserva);
    }
    // ==========================================
    // DELEGAÇÃO: OPERAÇÕES, FATURAÇÃO E CLÍNICA
    // ==========================================
    async adicionarRegistoDiario(animalId, descricao, fotos = []) {
        return await this.gestOperacoes.adicionarRegistoDiario(animalId, descricao, fotos);
    }
    async faturarReserva(idReserva, nifCliente) {
        return await this.gestFaturacao.gerarFaturaFinal(idReserva, nifCliente);
    }
    async prescreverMedicacao(dados) {
        return await this.gestClinica.prescreverMedicacao(dados);
    }
    // ==========================================
    // DELEGAÇÃO: TAREFAS E FUNCIONÁRIOS
    // ==========================================
    async listarTarefasDoDia() {
        return await this.gestReservas.listarTarefasDoDia();
    }
    async marcarTarefaConcluida(idServico) {
        return await this.gestReservas.marcarTarefaConcluida(idServico);
    }
    async contarFuncionarios() {
        return await this.gestOperacoes.contarFuncionarios();
    }
    async listarFuncionarios() {
        return await this.gestOperacoes.listarFuncionarios();
    }
    // ==========================================
    // DIARIO DE BORDO
    // ==========================================
    async animalDiario(animalId) {
        return await this.gestHospedes.animalDiario(animalId);
    }
    async listarServicosFinalizados(animalId) {
        return await this.gestReservas.obterServicosFinalizadosHoje(animalId);
    }
}
exports.GestorHotelFacade = GestorHotelFacade;
