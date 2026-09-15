import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'profesores-jwt-super-secret-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    area?: string;
  };
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado: No se proporcionó el token en la cabecera Authorization (formato Bearer <token>).',
      code: 'TOKEN_MISSING'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Formato de token inválido. Debe ser: Bearer <token>.',
      code: 'INVALID_TOKEN_FORMAT'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; area?: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado. Inicie sesión nuevamente.',
      code: 'TOKEN_INVALID_OR_EXPIRED',
      details: err.message
    });
  }
}
