import { PrescricaoDAO } from '../dao/PrescricaoDAO';
import { StockDAO } from '../dao/StockDAO';
import { LogsDAO } from '../dao/LogsDAO';

export class GestClinicaFacade {
  private prescricaoDAO: PrescricaoDAO;
  private stockDAO: StockDAO;
  private logsDAO: LogsDAO;

  constructor() {
    this.prescricaoDAO = new PrescricaoDAO();
    this.stockDAO = new StockDAO();
    this.logsDAO = new LogsDAO();
  }

  // Regra de Negócio: Validação Clínica (US03)
  async prescreverMedicacao(dadosPrescricao: any) {
    if (dadosPrescricao.dosagem <= 0) {
      throw new Error("A dosagem clínica deve ser superior a zero.");
    }
    return await this.prescricaoDAO.create(dadosPrescricao);
  }

  // Regra de Negócio: Log de Administração Imutável (RF.22 / R15)
  async registarAdministracaoFoco(funcionarioId: string) {
    return await this.logsDAO.createLog(funcionarioId);
  }
}