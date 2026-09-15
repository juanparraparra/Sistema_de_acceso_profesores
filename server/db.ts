import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface IProfesorDoc {
  _id: string;
  nombre: string;
  email: string;
  password: string; // bcrypt hash
  area: string;
  telefono?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Fallback persistence file when MONGODB_URI is not provided or unavailable
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mongodb_profesores.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial demo seed if empty
function initEmbeddedDB(): IProfesorDoc[] {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading embedded db, initializing empty:', e);
    }
  }

  // Initial seed teacher so the user can immediately test login or view MongoDB docs
  const defaultHash = bcrypt.hashSync('profesor123', 10);
  const seed: IProfesorDoc[] = [
    {
      _id: '65f9a1b2c3d4e5f6a7b8c901',
      nombre: 'Dra. Carmen Valenzuela',
      email: 'carmen.valenzuela@universidad.edu',
      password: defaultHash,
      area: 'Ciencias de la Computación',
      telefono: '+52 55 1234 5678',
      activo: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      __v: 0,
    },
    {
      _id: '65f9a1b2c3d4e5f6a7b8c902',
      nombre: 'Dr. Alejandro Morales',
      email: 'alejandro.morales@universidad.edu',
      password: defaultHash,
      area: 'Matemáticas y Física',
      telefono: '+52 55 8765 4321',
      activo: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      __v: 0,
    }
  ];

  fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
  return seed;
}

let embeddedDocs: IProfesorDoc[] = initEmbeddedDB();

function saveEmbeddedDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(embeddedDocs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving embedded MongoDB file:', e);
  }
}

export interface IProfesorSchema {
  nombre: string;
  email: string;
  password: string;
  area: string;
  telefono?: string;
  activo: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Mongoose Schema Definition
const ProfesorSchema = new mongoose.Schema<IProfesorSchema>(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    area: { type: String, required: true, trim: true },
    telefono: { type: String, default: '' },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProfesorModel: mongoose.Model<IProfesorSchema> =
  (mongoose.models.Profesor as mongoose.Model<IProfesorSchema>) ||
  mongoose.model<IProfesorSchema>('Profesor', ProfesorSchema);

export interface DBStatus {
  connected: boolean;
  mode: 'MONGODB_ATLAS' | 'EMBEDDED_MONGODB';
  database: string;
  collection: string;
  host: string;
  totalDocuments: number;
  lastSync: string;
}

let isMongooseConnected = false;
let mongooseHost = '';

export async function initMongoDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Intentando conectar con MongoDB...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      isMongooseConnected = true;
      mongooseHost = mongoose.connection.host || 'cluster-remote';
      console.log(`[MongoDB] Conectado exitosamente a: ${mongooseHost} (${mongoose.connection.name})`);
    } catch (err: any) {
      console.warn(`[MongoDB] No se pudo conectar a MONGODB_URI (${err.message}). Utilizando almacenamiento MongoDB Emulado BSON.`);
      isMongooseConnected = false;
    }
  } else {
    console.log('[MongoDB] MONGODB_URI no configurado. Operando con motor MongoDB Emulado BSON persistente.');
    isMongooseConnected = false;
  }
}

// Unified repository methods that work transparently with either real MongoDB or Embedded MongoDB
export const ProfesorRepository = {
  async findByEmail(email: string): Promise<IProfesorDoc | null> {
    const normalized = email.toLowerCase().trim();
    if (isMongooseConnected) {
      const doc = await ProfesorModel.findOne({ email: normalized }).lean();
      if (!doc) return null;
      return {
        _id: String(doc._id),
        nombre: doc.nombre,
        email: doc.email,
        password: doc.password,
        area: doc.area,
        telefono: doc.telefono,
        activo: doc.activo,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
        __v: doc.__v,
      };
    } else {
      const found = embeddedDocs.find(p => p.email.toLowerCase() === normalized);
      return found ? { ...found } : null;
    }
  },

  async findById(id: string): Promise<IProfesorDoc | null> {
    if (isMongooseConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const doc = await ProfesorModel.findById(id).lean();
      if (!doc) return null;
      return {
        _id: String(doc._id),
        nombre: doc.nombre,
        email: doc.email,
        password: doc.password,
        area: doc.area,
        telefono: doc.telefono,
        activo: doc.activo,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
        __v: doc.__v,
      };
    } else {
      const found = embeddedDocs.find(p => p._id === id);
      return found ? { ...found } : null;
    }
  },

  async create(data: {
    nombre: string;
    email: string;
    password: string;
    area: string;
    telefono?: string;
  }): Promise<IProfesorDoc> {
    const normalizedEmail = data.email.toLowerCase().trim();

    if (isMongooseConnected) {
      const doc = new ProfesorModel({
        nombre: data.nombre.trim(),
        email: normalizedEmail,
        password: data.password,
        area: data.area.trim(),
        telefono: data.telefono?.trim() || '',
        activo: true,
      });
      await doc.save();
      return {
        _id: String(doc._id),
        nombre: doc.nombre,
        email: doc.email,
        password: doc.password,
        area: doc.area,
        telefono: doc.telefono,
        activo: doc.activo,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
        __v: doc.__v,
      };
    } else {
      // Generate a realistic 24-hex MongoDB ObjectId
      const hexTimestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
      const randomHex = crypto.randomBytes(8).toString('hex');
      const newId = `${hexTimestamp}${randomHex}`;
      const now = new Date().toISOString();

      const newProfesor: IProfesorDoc = {
        _id: newId,
        nombre: data.nombre.trim(),
        email: normalizedEmail,
        password: data.password,
        area: data.area.trim(),
        telefono: data.telefono?.trim() || '',
        activo: true,
        createdAt: now,
        updatedAt: now,
        __v: 0,
      };

      embeddedDocs.unshift(newProfesor);
      saveEmbeddedDB();
      return { ...newProfesor };
    }
  },

  async getAll(): Promise<IProfesorDoc[]> {
    if (isMongooseConnected) {
      const docs = await ProfesorModel.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({
        _id: String(d._id),
        nombre: d.nombre,
        email: d.email,
        password: d.password,
        area: d.area,
        telefono: d.telefono,
        activo: d.activo,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
        __v: d.__v,
      }));
    } else {
      return [...embeddedDocs];
    }
  },

  async getStatus(): Promise<DBStatus> {
    const total = isMongooseConnected ? await ProfesorModel.countDocuments() : embeddedDocs.length;
    return {
      connected: true,
      mode: isMongooseConnected ? 'MONGODB_ATLAS' : 'EMBEDDED_MONGODB',
      database: isMongooseConnected ? (mongoose.connection.name || 'profesores_db') : 'profesores_db (Emulado BSON)',
      collection: 'profesores',
      host: isMongooseConnected ? mongooseHost : 'localhost:27017 (In-Engine)',
      totalDocuments: total,
      lastSync: new Date().toISOString(),
    };
  }
};
