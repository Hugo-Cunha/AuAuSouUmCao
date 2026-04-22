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
  const { username, password } = req.body; // Já não recebemos a "role" do frontend!

  try {
    // Busca o utilizador e traz logo a informação se ele é Tutor ou Funcionario
    const utilizador = await prisma.utilizador.findFirst({
      where: { email: username },
      include: {
        tutor: true,
        funcionario: true
      }
    });

    if (!utilizador) {
      return res.status(401).json({ error: 'Utilizador não encontrado!' });
    }

    if (utilizador.password !== password) {
      return res.status(401).json({ error: 'A password está incorreta!' });
    }

    // O Backend descobre qual é a Role real da pessoa
    let roleReal = 'Tutor'; // Assume que é Tutor por defeito
    if (utilizador.funcionario) {
      roleReal = utilizador.funcionario.perfil; // Pode ser 'Admin', 'Staff' ou 'Vet'
    }

    const token = jwt.sign(
      { userId: utilizador.idUtilizador, role: roleReal }, 
      process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026', 
      { expiresIn: '8h' }
    );

    // Devolvemos o token, a Role e os DADOS PESSOAIS para o frontend!
    res.status(200).json({ 
      message: `Bem-vindo, ${utilizador.nome}!`, 
      token: token,
      role: roleReal,
      nome: utilizador.nome,
      nif: utilizador.tutor ? utilizador.tutor.nif : '---',
      telemovel: utilizador.tutor ? utilizador.tutor.contacto : '---'
    });
  } catch (error) {
    console.error("Erro no Login:", error);
    res.status(500).json({ error: 'Erro interno ao validar o login.' });
  }
});

  // 3. ROTA DO DIÁRIO DE BORDO DO STAFF
router.get('/animais/:idAnimal/historial', async (req: Request, res: Response) => {
  const { idAnimal } = req.params;

  try {
    // Procura o animal e o seu diário de bordo na Base de Dados
    const animal = await prisma.animal.findUnique({
      where: { idAnimal: idAnimal },
      include: {
        diarioBordo: {
          orderBy: { timestamp: 'desc' } // Ordena do mais recente para o mais antigo
        }
      }
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado na base de dados.' });
    }

    // Formata os dados exatamente como o Frontend está à espera
    const historial = {
      idAnimal: animal.idAnimal,
      nome: animal.nome,
      estadoClinico: animal.estado,
      diarioBordo: animal.diarioBordo.map((registo: any) => ({
        dataHora: registo.timestamp,
        descricao: registo.descricao,
        fotoUrl: registo.fotos[0] || ''
      }))
    };

    res.status(200).json(historial);
  } catch (error) {
    console.error("Erro ao buscar historial:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// 4. ROTA PARA LISTAR TODOS OS ANIMAIS
router.get('/animais', async (req: Request, res: Response) => {
  try {
    const animais = await prisma.animal.findMany({
      include: {
        planoVacinal: true
      }
    });

    res.status(200).json(animais);
  } catch (error) {
    console.error("Erro ao listar animais:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// 5. ROTA PARA CRIAR UM NOVO ANIMAL
router.post('/animais', async (req: Request, res: Response) => {
  const { nome, raca, tutorNif, microchip, estado } = req.body;

  try {
    // Verificar se o tutor existe
    const tutorExiste = await prisma.tutor.findUnique({
      where: { nif: tutorNif }
    });

    if (!tutorExiste) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    const novoAnimal = await prisma.animal.create({
      data: {
        nome: nome || 'Animal sem nome',
        raca: raca || 'Raça desconhecida',
        tutorNif: tutorNif,
        microchip: microchip || `CHIP-${Date.now()}`, // Gera um único se não for fornecido
        estado: estado || 'Saudavel',
        reatividade: 'Normal'
      }
    });

    res.status(201).json(novoAnimal);
  } catch (error) {
    console.error("Erro ao criar animal:", error);
    res.status(500).json({ error: 'Erro interno ao criar animal.' });
  }
});

// 6. ROTA PARA LISTAR TODAS AS RESERVAS
router.get('/reservas', async (req: Request, res: Response) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        animal: true,
        box: true,
        servicos: true,
        fatura: true
      },
      orderBy: { dataEntrada: 'desc' }
    });

    res.status(200).json(reservas);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// 7. ROTA PARA CRIAR UMA NOVA RESERVA
router.post('/reservas', async (req: Request, res: Response) => {
  const { data, idAnimal, boxNumero } = req.body;

  try {
    // Verificar se o animal existe
    const animalExiste = await prisma.animal.findUnique({
      where: { idAnimal: idAnimal }
    });

    if (!animalExiste) {
      return res.status(404).json({ error: 'Animal não encontrado.' });
    }

    // Se não houver box disponível, usar um padrão
    const boxParaUsar = boxNumero || 1;

    // Verificar se o box existe
    const boxExiste = await prisma.box.findUnique({
      where: { numero: boxParaUsar }
    });

    if (!boxExiste) {
      return res.status(404).json({ error: 'Box não encontrado.' });
    }

    // Criar a reserva com data de entrada e saída
    const dataEntrada = new Date(data);
    const dataSaida = new Date(dataEntrada);
    dataSaida.setDate(dataSaida.getDate() + 1); // Por padrão, 1 dia de estadia

    const novaReserva = await prisma.reserva.create({
      data: {
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        valor: 0, // Será definido depois
        estado: 'Pendente',
        animalId: idAnimal,
        boxNumero: boxParaUsar
      },
      include: {
        animal: true,
        box: true,
        servicos: true
      }
    });

    res.status(201).json(novaReserva);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({ error: 'Erro interno ao criar reserva.' });
  }
});

// 8. ROTA PARA ELIMINAR UMA RESERVA
router.delete('/reservas/:idReserva', async (req: Request, res: Response) => {
  const { idReserva } = req.params;

  try {
    const reservaExiste = await prisma.reserva.findUnique({
      where: { idReserva: idReserva }
    });

    if (!reservaExiste) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    // Apagar primeiro os serviços associados
    await prisma.servico.deleteMany({
      where: { reservaId: idReserva }
    });

    // Depois apagar a reserva
    const reservaApagada = await prisma.reserva.delete({
      where: { idReserva: idReserva }
    });

    res.status(200).json({ message: 'Reserva eliminada com sucesso!', reserva: reservaApagada });
  } catch (error) {
    console.error("Erro ao eliminar reserva:", error);
    res.status(500).json({ error: 'Erro interno ao eliminar reserva.' });
  }
});

export default router;