import { UtilizadorDAO } from '../dao/UtilizadorDAO';
import { AnimalDAO } from '../dao/AnimalDAO';

export class GestHospedesFacade {
  private utilizadorDAO: UtilizadorDAO;
  private animalDAO: AnimalDAO;

  constructor() {
    // A Fachada "liga-se" aos DAOs para poder falar com a base de dados
    this.utilizadorDAO = new UtilizadorDAO();
    this.animalDAO = new AnimalDAO();
  }

  // ==========================================
  // REGRAS DE NEGÓCIO: UTILIZADORES E TUTORES
  // ==========================================
  
  async criarContaTutor(nome: string, email: string, passwordHash: string, nif: string, telemovel: string) {
    // Aqui entram as regras de negócio puras (Core) antes de gravar!
    if (!email.includes('@')) {
        throw new Error("Formato de email inválido.");
    }
    
    const existe = await this.utilizadorDAO.findByEmail(email);
    if (existe) {
        throw new Error("Já existe uma conta com este Email!");
    }

    // Se passou as regras, o DAO grava.
    return await this.utilizadorDAO.createTutor(nome, email, passwordHash, nif, telemovel);
  }

  async buscarUtilizadorPorEmail(email: string) {
    return await this.utilizadorDAO.findByEmail(email);
  }

  // ==========================================
  // REGRAS DE NEGÓCIO: ANIMAIS E VACINAS
  // ==========================================

  async registarAnimal(dadosAnimal: any, dadosVacina?: any) {
    // Regra de Negócio (Requisito RF.18): Se não houver microchip, geramos um provisório
    if (!dadosAnimal.microchip) {
      dadosAnimal.microchip = `CHIP-${Date.now()}`;
    }

    // Regra de Negócio: Por defeito, os PDFs de vacinas submetidos não estão válidos
    if (dadosVacina) {
        dadosVacina.isValido = false;
        dadosVacina.estado = 'Valido'; // O estado físico da vacina até a receção confirmar
    }

    return await this.animalDAO.createAnimal(dadosAnimal, dadosVacina);
  }

  async listarTodosAnimais() {
    return await this.animalDAO.findAll();
  }

  async listarAnimaisTutor(nif: string) {
    return await this.animalDAO.findByTutorNif(nif);
  }

  // ==========================================
  // ATUALIZAÇÃO DE PLANO VACINAL (Receção)
  // ==========================================
  async atualizarPlanoVacinal(idAnimal: string, dadosVacina: any) {
    // Validação: O animal deve existir
    const animal = await this.animalDAO.findByIdWithHistorial(idAnimal);
    if (!animal) {
      throw new Error("Animal não encontrado.");
    }

    // Regra de Negócio: A data deve ser válida
    if (dadosVacina.dataUltimaVacina) {
      const data = new Date(dadosVacina.dataUltimaVacina);
      if (isNaN(data.getTime())) {
        throw new Error("Data da vacina inválida.");
      }
    }

    return await this.animalDAO.updatePlanoVacinal(idAnimal, dadosVacina);
  }

  // ==========================================
  // HISTORIAL E DIÁRIO
  // ==========================================
  async obterHistorialAnimal(idAnimal: string) {
    return await this.animalDAO.findHistorialComDados(idAnimal);
  }

  async animalDiario(idAnimal: string) {
    return await this.animalDAO.animalDiario(idAnimal);
  }
}