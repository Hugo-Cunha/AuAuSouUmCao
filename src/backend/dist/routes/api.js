"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const GestorHotelFacade_1 = require("../core/GestorHotelFacade");
const auth_1 = require("../middleware/auth");
const S3StorageAdapter_1 = require("../adapters/S3StorageAdapter");
const router = (0, express_1.Router)();
const gestor = new GestorHotelFacade_1.GestorHotelFacade();
const s3Adapter = new S3StorageAdapter_1.S3StorageAdapter();
// Multer usa a RAM para não encher o disco da AWS
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// ==========================================
// 1. ROTAS PÚBLICAS (Sem tranca)
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, nif, telemovel, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const novoUser = await gestor.criarConta(username, email, hashedPassword, nif, telemovel);
        res.status(201).json({ message: 'Conta criada com sucesso!', user: novoUser });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const utilizador = await gestor.buscarUtilizador(username);
        if (!utilizador || !(await bcrypt_1.default.compare(password, utilizador.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const roleReal = utilizador.funcionario ? utilizador.funcionario.perfil : 'Tutor';
        const token = jsonwebtoken_1.default.sign({ userId: utilizador.idUtilizador, role: roleReal }, process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026', { expiresIn: '8h' });
        res.status(200).json({
            message: `Bem-vindo, ${utilizador.nome}!`,
            token, role: roleReal, nome: utilizador.nome,
            nif: utilizador.tutor?.nif || '---'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});
// ==========================================
// BARREIRA DE SEGURANÇA (JWT)
// ==========================================
router.use(auth_1.authMiddleware);
// ==========================================
// 2. ROTAS PROTEGIDAS
// ==========================================
router.get('/documentos/ver/:chave(*)', async (req, res) => {
    try {
        const { chave } = req.params;
        const urlTemporaria = await s3Adapter.gerarLinkTemporario(chave);
        // MUDANÇA AQUI: Devolvemos a URL no formato JSON em vez de fazer redirect
        res.json({ url: urlTemporaria });
    }
    catch (error) {
        res.status(404).json({ error: "Documento não encontrado ou acesso expirado." });
    }
});
// ANIMAIS
router.get('/animais', async (req, res) => {
    const animais = await gestor.listarAnimais();
    res.json(animais);
});
router.get('/animais/tutor/:nif', async (req, res) => {
    const animais = await gestor.listarAnimaisTutor(req.params.nif);
    res.json(animais);
});
// --- ROTA DE UPLOAD PARA O S3 ---
router.post('/animais', upload.single('vacinasFile'), async (req, res) => {
    try {
        const uploadedFile = req.file;
        let s3Referencia = undefined;
        if (uploadedFile) {
            s3Referencia = await s3Adapter.uploadFicheiro(uploadedFile.originalname, uploadedFile.buffer, uploadedFile.mimetype, 'documentos' // Fica trancado na pasta documentos
            );
        }
        const { boletimVacinasUrl, ...dadosLimposParaA_BD } = req.body;
        const novoAnimal = await gestor.registarAnimal(dadosLimposParaA_BD, uploadedFile ? {
            dataUltimaVacina: new Date(),
            documento: s3Referencia
        } : undefined);
        res.status(201).json(novoAnimal);
    }
    catch (error) {
        console.error("Erro ao adicionar animal:", error);
        res.status(400).json({ error: error.message });
    }
});
// RESERVAS E RESTANTES ROTAS
router.get('/reservas', async (req, res) => {
    const reservas = await gestor.listarReservas();
    res.json(reservas);
});
router.post('/reservas', async (req, res) => {
    try {
        const { banhos, tosquias, passeios, idAnimal, ...resto } = req.body;
        const dadosReserva = { ...resto, animalId: idAnimal };
        const servicos = [];
        if (banhos > 0)
            for (let i = 0; i < banhos; i++)
                servicos.push({ tipo: 'Adestramento', preco: 20, data: new Date() });
        if (tosquias > 0)
            for (let i = 0; i < tosquias; i++)
                servicos.push({ tipo: 'Grooming', preco: 10, data: new Date() });
        if (passeios > 0)
            for (let i = 0; i < passeios; i++)
                servicos.push({ tipo: 'Passeio', preco: 10, data: new Date() });
        const reserva = await gestor.efetuarReserva(dadosReserva, servicos);
        res.status(201).json(reserva);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/reservas/:id/checkin', async (req, res) => {
    try {
        const r = await gestor.checkIn(req.params.id);
        res.json(r);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/reservas/:id/checkout', async (req, res) => {
    try {
        const r = await gestor.checkOut(req.params.id);
        res.json(r);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/reservas/:id/cancelar', async (req, res) => {
    try {
        const r = await gestor.cancelarReserva(req.params.id);
        res.json(r);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/plano-vacinal/:idAnimal', async (req, res) => {
    try {
        const { dataUltimaVacina, isValido, estado } = req.body;
        const planoAtualizado = await gestor.atualizarPlanoVacinal(req.params.idAnimal, {
            dataUltimaVacina: dataUltimaVacina ? new Date(dataUltimaVacina) : undefined,
            isValido: isValido ?? false,
            estado: estado || 'Valido'
        });
        res.json(planoAtualizado);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/tarefas', async (req, res) => {
    try {
        const tarefas = await gestor.listarTarefasDoDia();
        res.json(tarefas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch('/tarefas/:id/concluir', async (req, res) => {
    try {
        const tarefa = await gestor.marcarTarefaConcluida(req.params.id);
        res.json(tarefa);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/funcionarios/count', async (req, res) => {
    try {
        const total = await gestor.contarFuncionarios();
        res.json({ total });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/funcionarios', async (req, res) => {
    try {
        const funcionarios = await gestor.listarFuncionarios();
        res.json(funcionarios);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/animais/:idAnimal/historial', async (req, res) => {
    try {
        const historial = await gestor.animalDiario(req.params.idAnimal);
        res.json(historial);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/animais/:idAnimal/servicos-finalizados', async (req, res) => {
    try {
        const servicos = await gestor.listarServicosFinalizados(req.params.idAnimal);
        res.json(servicos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
