import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import { GestorHotelFacade } from '../core/GestorHotelFacade';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const gestor = new GestorHotelFacade(); // O nosso Maestro

// Configuração do Multer para Uploads (Mantemos aqui por ser infraestrutura web)
if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads'); }
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ==========================================
// 1. ROTAS PÚBLICAS (Sem tranca)
// ==========================================

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, nif, telemovel, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const novoUser = await gestor.criarConta(username, email, hashedPassword, nif, telemovel);
    res.status(201).json({ message: 'Conta criada com sucesso!', user: novoUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const utilizador = await gestor.buscarUtilizador(username);

    if (!utilizador || !(await bcrypt.compare(password, utilizador.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const roleReal = utilizador.funcionario ? utilizador.funcionario.perfil : 'Tutor';
    const token = jwt.sign(
      { userId: utilizador.idUtilizador, role: roleReal },
      process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026',
      { expiresIn: '8h' }
    );

    res.status(200).json({ 
      message: `Bem-vindo, ${utilizador.nome}!`, // <-- CORREÇÃO: O pop-up já vai funcionar!
      token, role: roleReal, nome: utilizador.nome, 
      nif: utilizador.tutor?.nif || '---' 
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// ==========================================
// BARREIRA DE SEGURANÇA (JWT)
// Todas as rotas abaixo exigem Token
// ==========================================
router.use(authMiddleware);

// ==========================================
// 2. ROTAS PROTEGIDAS (Delegadas ao Maestro)
// ==========================================

// ANIMAIS
router.get('/animais', async (req, res) => {
  const animais = await gestor.listarAnimais();
  res.json(animais);
});

router.get('/animais/tutor/:nif', async (req, res) => {
  const animais = await gestor.listarAnimaisTutor(req.params.nif);
  res.json(animais);
});

router.post('/animais', upload.single('vacinasFile'), async (req, res) => {
  try {
    const uploadedFile = (req as any).file;
    const caminhoDoc = uploadedFile ? `/uploads/${uploadedFile.filename}` : undefined;
    
    // CORREÇÃO: Vamos retirar o boletimVacinasUrl do req.body para o Prisma não bloquear!
    const { boletimVacinasUrl, ...dadosLimposParaA_BD } = req.body;
    
    const novoAnimal = await gestor.registarAnimal(dadosLimposParaA_BD, uploadedFile ? {
      dataUltimaVacina: new Date(),
      documento: caminhoDoc
    } : undefined);

    res.status(201).json(novoAnimal);
  } catch (error: any) {
    console.error("Erro ao adicionar animal:", error); // Isto ajuda-nos a ver erros no terminal!
    res.status(400).json({ error: error.message });
  }
});

// RESERVAS
router.get('/reservas', async (req, res) => {
  const reservas = await gestor.listarReservas();
  res.json(reservas);
});

router.post('/reservas', async (req: Request, res: Response) => {
  try {
    // 1. Extraímos o idAnimal que vem do Frontend
    const { banhos, tosquias, passeios, idAnimal, ...resto } = req.body;
    
    // 2. Mudamos-lhe o nome para 'animalId' para o Prisma e a Fachada ficarem felizes!
    const dadosReserva = { ...resto, animalId: idAnimal };
    
    // Preparar array de serviços para a Fachada
    const servicos: any[] = [];
    if (banhos > 0) for(let i=0; i<banhos; i++) servicos.push({ tipo: 'Adestramento', preco: 20, data: new Date() });
    if (tosquias > 0) for(let i=0; i<tosquias; i++) servicos.push({ tipo: 'Grooming', preco: 10, data: new Date() });
    if (passeios > 0) for(let i=0; i<passeios; i++) servicos.push({ tipo: 'Passeio', preco: 10, data: new Date() });

    const reserva = await gestor.efetuarReserva(dadosReserva, servicos);
    res.status(201).json(reserva);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// OPERAÇÕES DE ESTADO (CHECK-IN/OUT)
router.patch('/reservas/:id/checkin', async (req, res) => {
  try {
    const r = await gestor.checkIn(req.params.id);
    res.json(r);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
});

router.patch('/reservas/:id/checkout', async (req, res) => {
  try {
    const r = await gestor.checkOut(req.params.id);
    res.json(r);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
});

router.patch('/reservas/:id/cancelar', async (req, res) => {
  try {
    const r = await gestor.cancelarReserva(req.params.id);
    res.json(r);
  } catch (error: any) { res.status(400).json({ error: error.message }); }
});

// ==========================================
// PLANO VACINAL
// ==========================================
router.patch('/plano-vacinal/:idAnimal', async (req, res) => {
  try {
    const { dataUltimaVacina, isValido, estado } = req.body;
    const planoAtualizado = await gestor.atualizarPlanoVacinal(req.params.idAnimal, {
      dataUltimaVacina: dataUltimaVacina ? new Date(dataUltimaVacina) : undefined,
      isValido: isValido ?? false,
      estado: estado || 'Valido'
    });
    res.json(planoAtualizado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }     
});

// ==========================================
// TAREFAS (STAFF)
// ==========================================
router.get('/tarefas', async (req, res) => {
  try {
    const tarefas = await gestor.listarTarefasDoDia();
    res.json(tarefas);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/tarefas/:id/concluir', async (req, res) => {
  try {
    const tarefa = await gestor.marcarTarefaConcluida(req.params.id);
    res.json(tarefa);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// FUNCIONÁRIOS
// ==========================================
router.get('/funcionarios/count', async (req, res) => {
  try {
    const total = await gestor.contarFuncionarios();
    res.json({ total });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/funcionarios', async (req, res) => {
  try {
    const funcionarios = await gestor.listarFuncionarios();
    res.json(funcionarios);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// DIARIO DE BORDO
// ==========================================

router.get('/animais/:idAnimal/historial', async (req,res) =>{
  try {
    const historial = await gestor.animalDiario(req.params.idAnimal); // A implementar: Obter os serviços do dia para o animal
    res.json(historial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/animais/:idAnimal/servicos-finalizados', async (req,res) =>{
  try {
    const servicos = await gestor.listarServicosFinalizados(req.params.idAnimal); // A implementar: Obter os serviços do dia para o animal
    res.json(servicos);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;