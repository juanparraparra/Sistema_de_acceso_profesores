import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import { ProfesorRepository } from '../db.js';

export const usersRouter = Router();

// C. Ruta protegida: Consultar /api/users/me usando el token
usersRouter.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Token no contiene un identificador de usuario válido.',
      });
    }

    // Query MongoDB for the authenticated professor's document
    const profesor = await ProfesorRepository.findById(userId);

    if (!profesor) {
      return res.status(404).json({
        success: false,
        error: 'El profesor asociado a este token no existe en la base de datos de MongoDB.',
      });
    }

    // Return the basic data requested: nombre, correo, área
    return res.status(200).json({
      success: true,
      message: 'Ruta protegida consultada exitosamente. Datos extraídos de MongoDB.',
      user: {
        _id: profesor._id,
        nombre: profesor.nombre,
        email: profesor.email,
        area: profesor.area,
        telefono: profesor.telefono,
        activo: profesor.activo,
        createdAt: profesor.createdAt,
        updatedAt: profesor.updatedAt,
      },
      tokenMeta: {
        tokenSubject: req.user?.email,
        authenticatedAt: new Date().toISOString(),
      },
      evidence: {
        endpoint: '/api/users/me',
        authMethod: 'Bearer Token JWT',
        dbSource: 'MongoDB (Colección: profesores)',
        deliveredFields: ['nombre', 'email', 'area', '_id'],
      }
    });
  } catch (err: any) {
    console.error('Error en /api/users/me:', err);
    return res.status(500).json({
      success: false,
      error: 'Error en el servidor al consultar la ruta protegida.',
      details: err.message,
    });
  }
});
