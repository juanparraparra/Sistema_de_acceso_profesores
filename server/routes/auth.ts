import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ProfesorRepository } from '../db.js';
import { JWT_SECRET } from '../middleware/auth.js';

export const authRouter = Router();

// Validation helper
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 1. Registro de profesor
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, area, telefono } = req.body;

    // Validation step 3 (Express valida)
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'El nombre completo es requerido y debe tener al menos 3 caracteres.',
        step: 3,
      });
    }

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Debe ingresar un correo electrónico institucional válido.',
        step: 3,
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener un mínimo de 6 caracteres.',
        step: 3,
      });
    }

    if (!area || typeof area !== 'string' || area.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Debe especificar el área o departamento académico del profesor.',
        step: 3,
      });
    }

    // Check if email already exists in MongoDB
    const existing = await ProfesorRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `El correo '${email}' ya se encuentra registrado en el sistema.`,
        step: 3,
      });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Persist in MongoDB step 4 (MongoDB guarda)
    const nuevoProfesor = await ProfesorRepository.create({
      nombre,
      email,
      password: hashedPassword,
      area,
      telefono: telefono || '',
    });

    // Generate JWT step 5 (JWT + respuesta)
    const token = jwt.sign(
      {
        id: nuevoProfesor._id,
        email: nuevoProfesor.email,
        nombre: nuevoProfesor.nombre,
        area: nuevoProfesor.area,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Profesor registrado con éxito y persistido en MongoDB.',
      token,
      user: {
        _id: nuevoProfesor._id,
        nombre: nuevoProfesor.nombre,
        email: nuevoProfesor.email,
        area: nuevoProfesor.area,
        telefono: nuevoProfesor.telefono,
        createdAt: nuevoProfesor.createdAt,
      },
      flow: {
        step1: 'Profesor completó formulario en Vue',
        step2: 'Vue envió JSON POST /api/auth/register',
        step3: 'Express validó campos y hasheó contraseña con bcrypt',
        step4: `MongoDB guardó documento con _id: ${nuevoProfesor._id}`,
        step5: 'JWT generado y enviado como respuesta',
      }
    });
  } catch (err: any) {
    console.error('Error en /api/auth/register:', err);
    return res.status(500).json({
      success: false,
      error: 'Error interno en el servidor al registrar profesor.',
      details: err.message,
    });
  }
});

// 2. Login de profesor
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation step 3 (Express valida)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Debe ingresar tanto el correo electrónico como la contraseña.',
        step: 3,
      });
    }

    // Query in MongoDB step 4 (MongoDB consulta)
    const profesor = await ProfesorRepository.findByEmail(email);
    if (!profesor) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas: No se encontró un profesor registrado con ese correo en MongoDB.',
        step: 4,
      });
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, profesor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas: La contraseña ingresada no coincide.',
        step: 4,
      });
    }

    // Generate JWT step 5 (JWT + respuesta)
    const token = jwt.sign(
      {
        id: profesor._id,
        email: profesor.email,
        nombre: profesor.nombre,
        area: profesor.area,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        _id: profesor._id,
        nombre: profesor.nombre,
        email: profesor.email,
        area: profesor.area,
        telefono: profesor.telefono,
        createdAt: profesor.createdAt,
      },
      flow: {
        step1: 'Profesor ingresó credenciales en Vue',
        step2: 'Vue envió JSON POST /api/auth/login',
        step3: 'Express recibió solicitud y procesó datos',
        step4: `MongoDB consultó documento correspondiente a ${profesor.email}`,
        step5: 'JWT generado exitosamente con 24h de validez',
      }
    });
  } catch (err: any) {
    console.error('Error en /api/auth/login:', err);
    return res.status(500).json({
      success: false,
      error: 'Error interno en el servidor al autenticar profesor.',
      details: err.message,
    });
  }
});
