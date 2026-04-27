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
}