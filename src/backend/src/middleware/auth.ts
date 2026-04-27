import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Esta interface serve para o TypeScript não reclamar quando guardarmos o utilizador no req
export interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  // 1. O frontend envia o token no cabeçalho "Authorization"
  const authHeader = req.headers.authorization;

  // Se não houver cabeçalho ou não começar por "Bearer ", barramos a entrada
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Por favor, inicie sessão.' });
  }

  // 2. Extrair o token (separar a palavra "Bearer " do código gigante)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Tentar desencriptar o token com a nossa chave secreta
    const segredo = process.env.JWT_SECRET || 'chave_secreta_hotel_canino_2026';
    const utilizadorDecodificado = jwt.verify(token, segredo);

    // 4. Guardar a info do utilizador no pedido e abrir a porta (next)
    req.user = utilizadorDecodificado;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
};