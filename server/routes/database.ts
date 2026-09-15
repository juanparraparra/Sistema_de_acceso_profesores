import { Router, Request, Response } from 'express';
import { ProfesorRepository } from '../db.js';

export const databaseRouter = Router();

// GET /api/database/status
databaseRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await ProfesorRepository.getStatus();
    res.json({
      success: true,
      status,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// GET /api/database/profesores - Inspect raw MongoDB documents for verification
databaseRouter.get('/profesores', async (_req: Request, res: Response) => {
  try {
    const profesores = await ProfesorRepository.getAll();
    const status = await ProfesorRepository.getStatus();

    // Map documents to show MongoDB representation (safe password hash preview)
    const mongoDocs = profesores.map(p => ({
      _id: p._id,
      nombre: p.nombre,
      email: p.email,
      password: `${p.password.substring(0, 10)}... (bcrypt hash)`,
      area: p.area,
      telefono: p.telefono || '',
      activo: p.activo,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      __v: p.__v ?? 0,
    }));

    res.json({
      success: true,
      count: mongoDocs.length,
      database: status.database,
      collection: 'profesores',
      mode: status.mode,
      documents: mongoDocs,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Error al consultar documentos de MongoDB',
      details: err.message,
    });
  }
});
