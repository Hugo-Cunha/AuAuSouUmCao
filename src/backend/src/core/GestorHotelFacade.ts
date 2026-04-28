import { GestHospedesFacade } from './GestHospedesFacade';
import { GestReservasFacade } from './GestReservasFacade';
import { GestOperacoesFacade } from './GestOperacoesFacade';
import { GestFaturacaoFacade } from './GestFaturacaoFacade';
import { GestClinicaFacade } from './GestClinicaFacade';

export class GestorHotelFacade {
  private gestHospedes: GestHospedesFacade;
  private gestReservas: GestReservasFacade;
  private gestOperacoes: GestOperacoesFacade;
  private gestFaturacao: GestFaturacaoFacade;
  private gestClinica: GestClinicaFacade;

  constructor() {
    this.gestHospedes = new GestHospedesFacade();
    this.gestReservas = new GestReservasFacade();
    this.gestOperacoes = new GestOperacoesFacade();
    this.gestFaturacao = new GestFaturacaoFacade();
    this.gestClinica = new GestClinicaFacade();
  }

  // ==========================================
  // DELEGAÇÃO: HÓSPEDES E CONTAS
  // ==========================================
  async criarConta(nome: string, email: string, passwordHash: string, nif: string, telemovel: string) {
    return await this.gestHospedes.criarContaTutor(nome, email, passwordHash, nif, telemovel);
  }

  async buscarUtilizador(email: string) {
    return await this.gestHospedes.buscarUtilizadorPorEmail(email);
  }

  async registarAnimal(dadosAnimal: any, dadosVacina?: any) {
    return await this.gestHospedes.registarAnimal(dadosAnimal, dadosVacina);
  }

  async listarAnimais() { 
    return await this.gestHospedes.listarTodosAnimais(); 
  }

  async listarAnimaisTutor(nif: string) { 
    return await this.gestHospedes.listarAnimaisTutor(nif); 
  }

  async atualizarPlanoVacinal(idAnimal: string, dadosVacina: any) {
    return await this.gestHospedes.atualizarPlanoVacinal(idAnimal, dadosVacina);
  }

  async obterHistorialAnimal(idAnimal: string) {
    return await this.gestHospedes.obterHistorialAnimal(idAnimal);
  }

  async obterServicosFinalizadosHoje(idAnimal: string) {
    return await this.gestReservas.obterServicosFinalizadosHoje(idAnimal);
  }

  // ==========================================
  // DELEGAÇÃO: RESERVAS
  // ==========================================
  async efetuarReserva(dadosReserva: any, servicos: any[]) {
    return await this.gestReservas.criarReserva(dadosReserva, servicos);
  }

  async listarReservas() { 
    return await this.gestReservas.listarTodas(); 
  }

  async checkIn(idReserva: string) { 
    return await this.gestReservas.confirmarCheckIn(idReserva); 
  }

  async checkOut(idReserva: string) { 
    // Orquestração: Ao fazer check-out, podemos já chamar a faturação no futuro!
    return await this.gestReservas.confirmarCheckOut(idReserva); 
  }

  async cancelarReserva(idReserva: string) { 
    return await this.gestReservas.cancelarReserva(idReserva); 
  }

  async apagarReserva(idReserva: string) { 
    return await this.gestReservas.eliminarReserva(idReserva); 
  }

  // ==========================================
  // DELEGAÇÃO: OPERAÇÕES, FATURAÇÃO E CLÍNICA
  // ==========================================
  async adicionarRegistoDiario(animalId: string, descricao: string, fotos: string[] = []) {
    return await this.gestOperacoes.adicionarRegistoDiario(animalId, descricao, fotos);
  }

  async faturarReserva(idReserva: string, nifCliente: string) {
    return await this.gestFaturacao.gerarFaturaFinal(idReserva, nifCliente);
  }

  async prescreverMedicacao(dados: any) {
    return await this.gestClinica.prescreverMedicacao(dados);
  }

  // ==========================================
  // DELEGAÇÃO: TAREFAS E FUNCIONÁRIOS
  // ==========================================
  async listarTarefasDoDia() {
    return await this.gestReservas.listarTarefasDoDia();
  }

  async marcarTarefaConcluida(idServico: string) {
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
  async animalDiario(animalId: string) {
    return await this.gestHospedes.animalDiario(animalId);
  }

  async listarServicosFinalizados(animalId: string) {
    return await this.gestReservas.obterServicosFinalizadosHoje(animalId);
  }
}