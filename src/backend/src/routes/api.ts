import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer'; 
import fs from 'fs';         

const router = Router();
const prisma = new PrismaClient();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Adiciona um timestamp para evitar ficheiros com nomes repetidos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });


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
        tutor: {
          create: {
            nif: nif,
            contacto: telemovel 
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
  const { username, password } = req.body; 

  try {
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

    let roleReal = 'Tutor'; 
    if (utilizador.funcionario) {
      roleReal = utilizador.funcionario.perfil; 
    }

    const token = jwt.sign(
      { userId: utilizador.idUtilizador, role: roleReal }, 
      process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026', 
      { expiresIn: '8h' }
    );

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
    const animal = await prisma.animal.findUnique({
      where: { idAnimal: idAnimal },
      include: {
        diarioBordo: {
          orderBy: { timestamp: 'desc' } 
        }
      }
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado na base de dados.' });
    }

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

router.get('/animais/:idUser', async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;
    const animais = await prisma.animal.findMany({
      where: { tutorNif: idUser },
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

// 5. ROTA PARA CRIAR UM NOVO ANIMAL (Agora com MULTER para o PDF)
router.post('/animais', upload.single('vacinasFile'), async (req: Request, res: Response) => {
  // O multer coloca os campos de texto no req.body e o ficheiro no req.file
  const { nome, raca, tutorNif, microchip, estado, reatividade } = req.body;

  try {
    const tutorExiste = await prisma.tutor.findUnique({
      where: { nif: tutorNif }
    });

    if (!tutorExiste) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    // Verifica se recebemos um ficheiro PDF
    const caminhoDocumento = req.file ? `/uploads/${req.file.filename}` : 'Sem documento';

    const novoAnimal = await prisma.animal.create({
      data: {
        nome: nome || 'Animal sem nome',
        raca: raca || 'Raça desconhecida',
        tutorNif: tutorNif,
        microchip: microchip || `CHIP-${Date.now()}`, 
        estado: estado || 'Saudavel',
        reatividade: reatividade || 'Normal',
        
        // Magia do Prisma: Se houver ficheiro, cria logo o plano vacinal!
        planoVacinal: req.file ? {
          create: {
            dataUltimaVacina: new Date(), // Podes ajustar isto futuramente para vir do form
            documento: caminhoDocumento,
            isValido: true,
            estado: 'Valido'
          }
        } : undefined
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
        animal: {
          include: {
            tutor: {
              include: {
                utilizador: true // A MAGIA AQUI: Traz o nome do Dono!
              }
            },
            planoVacinal: true // Aproveitamos e garantimos que os PDFs vêm sempre
          }
        },
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
  const { data, dataEntrada, dataSaida, idAnimal, boxNumero, raca, reatividade, horaEntrega, horaLevantamento, banhos, tosquias, passeios, precoTotal } = req.body;

  try {
    const animalExiste = await prisma.animal.findUnique({
      where: { idAnimal: idAnimal }
    });
    if (!animalExiste) {
      return res.status(404).json({ error: 'Animal não encontrado.' });
    }
    
    const boxParaUsar = boxNumero || 1;

    const boxExiste = await prisma.box.findUnique({
      where: { numero: boxParaUsar }
    });

    if (!boxExiste) {
      return res.status(404).json({ error: 'Box não encontrado.' });
    }

    const inicio = dataEntrada ? new Date(dataEntrada) : data ? new Date(data) : null;
    if (!inicio || isNaN(inicio.getTime())) {
      return res.status(400).json({ error: 'Data de entrada inválida.' });
    }

    const fim = dataSaida ? new Date(dataSaida) : null;
    if (!fim || isNaN(fim.getTime())) {
      return res.status(400).json({ error: 'Data de saída inválida.' });
    }

    if (fim <= inicio) {
      return res.status(400).json({ error: 'A data de saída deve ser posterior à data de entrada.' });
    }

    const novaReserva = await prisma.reserva.create({
      data: {
        dataEntrada: inicio,
        dataSaida: fim,
        valor: precoTotal || 0,
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

    if ((banhos && banhos > 0) || (tosquias && tosquias > 0) || (passeios && passeios > 0)) {
      const servicosCriados = [];
      
      if (banhos && banhos > 0) {
        for (let i = 0; i < banhos; i++) {
          const servico = await prisma.servico.create({
            data: {
              data: new Date(),
              preco: 20,
              tipo: 'Adestramento',
              reservaId: novaReserva.idReserva
            }
          });
          servicosCriados.push(servico);
        }
      }
      
      if (tosquias && tosquias > 0) {
        for (let i = 0; i < tosquias; i++) {
          const servico = await prisma.servico.create({
            data: {
              data: new Date(),
              preco: 10,
              tipo: 'Grooming',
              reservaId: novaReserva.idReserva
            }
          });
          servicosCriados.push(servico);
        }
      }
      
      if (passeios && passeios > 0) {
        for (let i = 0; i < passeios; i++) {
          const servico = await prisma.servico.create({
            data: {
              data: new Date(),
              preco: 10,
              tipo: 'Passeio',
              reservaId: novaReserva.idReserva
            }
          });
          servicosCriados.push(servico);
        }
      }
      novaReserva.servicos = servicosCriados;
    }

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

    await prisma.servico.deleteMany({
      where: { reservaId: idReserva }
    });

    const reservaApagada = await prisma.reserva.delete({
      where: { idReserva: idReserva }
    });

    res.status(200).json({ message: 'Reserva eliminada com sucesso!', reserva: reservaApagada });
  } catch (error) {
    console.error("Erro ao eliminar reserva:", error);
    res.status(500).json({ error: 'Erro interno ao eliminar reserva.' });
  }

  // 9. ROTA PARA A RECEÇÃO: EFETUAR CHECK-IN E VALIDAR VACINAS
router.patch('/reservas/:idReserva/checkin', async (req: Request, res: Response) => {
  const { idReserva } = req.params;

  try {
    const reservaExistente = await prisma.reserva.findUnique({
      where: { idReserva: idReserva },
      include: { animal: { include: { planoVacinal: true } } }
    });

    if (!reservaExistente) return res.status(404).json({ error: 'Reserva não encontrada.' });
    if (reservaExistente.estado !== 'Pendente') return res.status(400).json({ error: 'A reserva já não se encontra pendente.' });

    const reservaAtualizada = await prisma.reserva.update({
      where: { idReserva: idReserva },
      data: { estado: 'CheckIn' }
    });

    if (reservaExistente.animal.planoVacinal) {
      await prisma.planoVacinal.update({
        where: { animalId: reservaExistente.animal.idAnimal },
        data: { isValido: true }
      });
    }

    res.status(200).json({ message: 'Check-in efetuado e vacinas validadas com sucesso!', reserva: reservaAtualizada });
  } catch (error) {
    console.error("Erro ao efetuar check-in:", error);
    res.status(500).json({ error: 'Erro interno ao efetuar check-in.' });
  }
});

// 10. ROTA PARA EFETUAR CHECK-OUT (PAGAR)
router.patch('/reservas/:idReserva/checkout', async (req: Request, res: Response) => {
  const { idReserva } = req.params;

  try {
    const reservaExistente = await prisma.reserva.findUnique({ where: { idReserva } });
    if (!reservaExistente) return res.status(404).json({ error: 'Reserva não encontrada.' });

    const reservaAtualizada = await prisma.reserva.update({
      where: { idReserva: idReserva },
      data: { estado: 'CheckOut' } // <-- Usamos o CheckOut do teu Enum do Prisma!
    });

    res.status(200).json({ message: 'Check-out efetuado e pago!', reserva: reservaAtualizada });
  } catch (error) {
    console.error("Erro ao efetuar check-out:", error);
    res.status(500).json({ error: 'Erro interno ao efetuar check-out.' });
  }
});
});

export default router;