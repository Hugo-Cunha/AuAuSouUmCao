import { DiarioBordoDAO } from '../dao/DiarioBordoDAO';

export class GestOperacoesFacade {
  private diarioDAO: DiarioBordoDAO;

  constructor() {
    this.diarioDAO = new DiarioBordoDAO();
  }

  // Regra de Negócio: O Diário de Bordo (US09 e RF.37)
  async adicionarRegistoDiario(animalId: string, descricao: string, fotos: string[] = []) {
    // Validação: Um registo tem de ter obrigatoriamente texto ou uma foto
    if (!descricao && fotos.length === 0) {
      throw new Error("O registo deve conter uma descrição ou fotografia.");
    }
    return await this.diarioDAO.create(descricao, animalId, fotos);
  }
}