import { DiarioBordoDAO } from '../dao/DiarioBordoDAO';
import { UtilizadorDAO } from '../dao/UtilizadorDAO';

export class GestOperacoesFacade {
  private diarioDAO: DiarioBordoDAO;
  private utilizadoresDAO: UtilizadorDAO;

  constructor() {
    this.diarioDAO = new DiarioBordoDAO();
    this.utilizadoresDAO = new UtilizadorDAO();
  }

  // Regra de Negócio: O Diário de Bordo (US09 e RF.37)
  async adicionarRegistoDiario(animalId: string, descricao: string, fotos: string[] = []) {
    // Validação: Um registo tem de ter obrigatoriamente texto ou uma foto
    if (!descricao && fotos.length === 0) {
      throw new Error("O registo deve conter uma descrição ou fotografia.");
    }
    return await this.diarioDAO.create(descricao, animalId, fotos);
  }

  // ==========================================
  // GESTÃO DE FUNCIONÁRIOS
  // ==========================================
  async contarFuncionarios() {
    return await this.utilizadoresDAO.countTotal();
  }

  async contarFuncionariosPorPerfil(perfil: string) {
    return await this.utilizadoresDAO.countByPerfil(perfil);
  }

  async listarFuncionarios() {
    return await this.utilizadoresDAO.findAll();
  }
}