"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsDAO = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LogsDAO {
    async createLog(funcionarioId) {
        return await prisma.logMedicacao.create({
            data: { funcionarioId }
        });
    }
}
exports.LogsDAO = LogsDAO;
