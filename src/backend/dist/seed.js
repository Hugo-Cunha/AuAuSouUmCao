"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('A plantar contas na Base de Dados...');
    // 1. A Diana (Gestora)
    await prisma.utilizador.upsert({
        where: { email: 'diana@auau.pt' },
        update: {},
        create: {
            nome: 'Diana Silva',
            email: 'diana@auau.pt',
            password: 'password123',
            funcionario: { create: { perfil: 'Admin' } }
        }
    });
    // 2. O Veterinário
    await prisma.utilizador.upsert({
        where: { email: 'vet@auau.pt' },
        update: {},
        create: {
            nome: 'Dr. Carlos',
            email: 'vet@auau.pt',
            password: 'password123',
            funcionario: { create: { perfil: 'Vet' } }
        }
    });
    // 3. O Staff (Cuidador)
    await prisma.utilizador.upsert({
        where: { email: 'staff@auau.pt' },
        update: {},
        create: {
            nome: 'João Cuidador',
            email: 'staff@auau.pt',
            password: 'password123',
            funcionario: { create: { perfil: 'Staff' } }
        }
    });
    await prisma.box.upsert({
        where: { numero: 1 },
        update: {},
        create: {
            numero: 1,
            tamanho: 2,
            ocupacao: 0,
            estado: 'Higienizada',
            reservas: {
                create: []
            }
        }
    });
    await prisma.animal.upsert({
        where: { idAnimal: 'A-789' },
        update: {},
        create: {
            idAnimal: 'A-789',
            nome: 'Bobi',
            raca: 'Labrador',
            reatividade: 'Baixa',
            microchip: 'PT123456789',
            estado: 'Saudavel',
            tutorNif: '123456789', // NIF da Maria Cliente!
            diarioBordo: {
                create: [
                    {
                        descricao: 'Passeio matinal concluído com muita energia! Brincou com a bola.',
                        fotos: []
                    },
                    {
                        descricao: 'Comeu a ração toda. Está muito bem disposto hoje.',
                        fotos: []
                    }
                ]
            }
        }
    });
    console.log('Contas criadas com SUCESSO! 🚀');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
