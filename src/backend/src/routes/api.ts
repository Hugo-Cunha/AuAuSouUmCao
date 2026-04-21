import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// 1. ROTA DE REGISTO (CRIAR CONTA)
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, nif, telemovel, password } = req.body;

  try {
    // 1.1 Verificar se o utilizador já existe (Apenas pelo email na tabela Utilizador)
    const utilizadorExistente = await prisma.utilizador.findFirst({
      where: { email: email }
    });

    if (utilizadorExistente) {
      return res.status(400).json({ error: 'Já existe uma conta com este Email!' });
    }

    // 1.2 Criar o utilizador e passar o NIF e Contacto para a tabela Tutor
    const novoUtilizador = await prisma.utilizador.create({
      data: {
        nome: username,
        email: email,
        password: password,
        // O Prisma cria automaticamente a linha na tabela Tutor com estes dados!
        tutor: {
          create: {
            nif: nif,
            contacto: telemovel // CORRIGIDO: A palavra exata do Prisma é "contacto"
          }
        }
      }
    });

    res.status(201).json({ message: 'Conta criada com sucesso!', user: novoUtilizador });
  } catch (error) {
    console.error("Erro no Registo:", error);
    res.status(500).json({ error: 'Erro interno ao comunicar com a Base de Dados.' });
  }
});

// 2. ROTA DE LOGIN
router.post('/login', async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    // 2.1 Buscar o utilizador pelo Email ou Username
    const utilizador = await prisma.utilizador.findFirst({
      where: {
        OR: [
          { email: username },
          { nome: username } 
        ]
      }
    });

    if (!utilizador) {
      return res.status(401).json({ error: 'Utilizador não encontrado!' });
    }

    // 2.2 Verificar a password
    if (utilizador.password !== password) {
      return res.status(401).json({ error: 'A password está incorreta!' });
    }

    // 2.3 Gerar o Token usando a chave primária correta (idUtilizador)
    const token = jwt.sign(
      { userId: utilizador.idUtilizador, role: role }, 
      process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026', 
      { expiresIn: '8h' }
    );

    res.status(200).json({ message: 'Login efetuado com sucesso!', token: token });
  } catch (error) {
    console.error("Erro no Login:", error);
    res.status(500).json({ error: 'Erro interno ao validar o login.' });
  }
});

export default router;