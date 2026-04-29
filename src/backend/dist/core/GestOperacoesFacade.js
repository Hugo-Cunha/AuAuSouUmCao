"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestOperacoesFacade = void 0;
const DiarioBordoDAO_1 = require("../dao/DiarioBordoDAO");
const UtilizadorDAO_1 = require("../dao/UtilizadorDAO");
class GestOperacoesFacade {
    diarioDAO;
    utilizadoresDAO;
    constructor() {
        this.diarioDAO = new DiarioBordoDAO_1.DiarioBordoDAO();
        this.utilizadoresDAO = new UtilizadorDAO_1.UtilizadorDAO();
    }
    // Regra de Negócio: O Diário de Bordo (US09 e RF.37)
    async adicionarRegistoDiario(animalId, descricao, fotos = []) {
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
    async contarFuncionariosPorPerfil(perfil) {
        return await this.utilizadoresDAO.countByPerfil(perfil);
    }
    async listarFuncionarios() {
        return await this.utilizadoresDAO.findAll();
    }
}
exports.GestOperacoesFacade = GestOperacoesFacade;
