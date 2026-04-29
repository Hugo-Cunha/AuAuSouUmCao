"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescricaoDAO = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrescricaoDAO {
    async create(dados) {
        return await prisma.prescricao.create({ data: dados });
    }
    async findByAnimal(animalId) {
        return await prisma.prescricao.findMany({ where: { animalId } });
    }
}
exports.PrescricaoDAO = PrescricaoDAO;
