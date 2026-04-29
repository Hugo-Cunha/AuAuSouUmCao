"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockDAO = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StockDAO {
    async findAll() {
        return await prisma.stock.findMany({ include: { medicamento: true } });
    }
    async updateQuantidade(idItem, novaQuantidade) {
        return await prisma.stock.update({
            where: { idItem },
            data: { quantidade: novaQuantidade }
        });
    }
}
exports.StockDAO = StockDAO;
