"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestClinicaFacade = void 0;
const PrescricaoDAO_1 = require("../dao/PrescricaoDAO");
const StockDAO_1 = require("../dao/StockDAO");
const LogsDAO_1 = require("../dao/LogsDAO");
class GestClinicaFacade {
    prescricaoDAO;
    stockDAO;
    logsDAO;
    constructor() {
        this.prescricaoDAO = new PrescricaoDAO_1.PrescricaoDAO();
        this.stockDAO = new StockDAO_1.StockDAO();
        this.logsDAO = new LogsDAO_1.LogsDAO();
    }
    // Regra de Negócio: Validação Clínica (US03)
    async prescreverMedicacao(dadosPrescricao) {
        if (dadosPrescricao.dosagem <= 0) {
            throw new Error("A dosagem clínica deve ser superior a zero.");
        }
        return await this.prescricaoDAO.create(dadosPrescricao);
    }
    // Regra de Negócio: Log de Administração Imutável (RF.22 / R15)
    async registarAdministracaoFoco(funcionarioId) {
        return await this.logsDAO.createLog(funcionarioId);
    }
    // ==========================================
    // GESTÃO DE CHECKS DIÁRIOS
    // ==========================================
    async registarCheckDiario(idAnimal, notas) {
        if (!notas || notas.trim().length === 0) {
            throw new Error("O check deve incluir notas do veterinário.");
        }
        return await this.prescricaoDAO.registarCheckDiario(idAnimal, notas);
    }
    async listarCaesParaVerificar() {
        return await this.prescricaoDAO.listarCaesParaVerificar();
    }
    async listarEmQuarentena() {
        return await this.prescricaoDAO.listarEmQuarentena();
    }
    async ativarQuarentena(idAnimal, motivo) {
        if (!motivo || motivo.trim().length === 0) {
            throw new Error("Deve incluir um motivo para a quarentena.");
        }
        return await this.prescricaoDAO.ativarQuarentena(idAnimal, motivo);
    }
    async desativarQuarentena(idAnimal) {
        return await this.prescricaoDAO.desativarQuarentena(idAnimal);
    }
    async verificarSeJaFoiCheckHoje(idAnimal) {
        return await this.prescricaoDAO.verificarSeJaFoiCheckHoje(idAnimal);
    }
}
exports.GestClinicaFacade = GestClinicaFacade;
