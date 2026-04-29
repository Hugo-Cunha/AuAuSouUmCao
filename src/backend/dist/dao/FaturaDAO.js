"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaturaDAO = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FaturaDAO {
    async create(dadosFatura) {
        return await prisma.faturas.create({
            data: dadosFatura
        });
    }
}
exports.FaturaDAO = FaturaDAO;
