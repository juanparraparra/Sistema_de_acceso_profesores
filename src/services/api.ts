import { AuthResponse, ProtectedUserResponse, DBStatus, MongoDocPreview } from '../types';

const TOKEN_KEY = 'profesor_auth_token';
const USER_KEY = 'profesor_auth_user';

export type StepUpdateCallback = (step: number, label: string, data?: any) => void;
let stepListener: StepUpdateCallback | null = null;

export function registerStepListener(cb: StepUpdateCallback | null) {
  stepListener = cb;
}

function notifyStep(step: number, label: string, data?: any) {
  if (stepListener) {
    stepListener(step, label, data);
  }
}

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const api = {
  async register(data: {
    nombre: string;
    email: string;
    password: string;
    area: string;
    telefono?: string;
  }): Promise<AuthResponse> {
    notifyStep(1, 'Profesor completó formulario en Vue');
    notifyStep(2, 'Vue envía JSON por POST /api/auth/register', {
      nombre: data.nombre,
      email: data.email,
      area: data.area,
    });

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    notifyStep(3, 'Express validó campos y hasheó contraseña con bcrypt');

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Error al registrar profesor en el servidor.');
    }

    notifyStep(4, 'MongoDB guardó documento en la colección "profesores"', result.user);
    notifyStep(5, 'JWT generado y devuelto con payload firmado', { tokenPreview: result.token?.substring(0, 20) + '...' });

    if (result.token) {
      authStorage.setToken(result.token);
      authStorage.setUser(result.user);
    }

    return result;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    notifyStep(1, 'Profesor ingresó credenciales en Vue');
    notifyStep(2, 'Vue envía JSON por POST /api/auth/login', { email: credentials.email });

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    notifyStep(3, 'Express validó solicitud y procesó credenciales');

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Error de autenticación.');
    }

    notifyStep(4, 'MongoDB consultó y verificó documento con hash bcrypt', result.user);
    notifyStep(5, 'JWT generado exitosamente y entregado a Vue', { tokenPreview: result.token?.substring(0, 20) + '...' });

    if (result.token) {
      authStorage.setToken(result.token);
      authStorage.setUser(result.user);
    }

    return result;
  },

  async getMe(): Promise<ProtectedUserResponse> {
    const token = authStorage.getToken();
    if (!token) {
      throw new Error('No hay sesión iniciada ni token disponible. Inicie sesión.');
    }

    notifyStep(2, 'Vue envía solicitud GET /api/users/me con Authorization: Bearer token');

    const res = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    notifyStep(3, 'Express verificó el token JWT con middleware verifyToken');

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        authStorage.clear();
      }
      throw new Error(result.error || 'Error al consultar la ruta protegida.');
    }

    notifyStep(4, 'MongoDB consultó el documento del profesor por _id', result.user);
    notifyStep(5, 'Respuesta 200 OK con nombre, correo y área del profesor');

    return result;
  },

  async getDatabaseStatus(): Promise<DBStatus> {
    const res = await fetch('/api/database/status');
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Error al obtener estado de base de datos.');
    }
    return data.status;
  },

  async getMongoDocuments(): Promise<{ count: number; documents: MongoDocPreview[]; mode: string; database: string }> {
    const res = await fetch('/api/database/profesores');
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Error al consultar documentos de MongoDB.');
    }
    return {
      count: data.count,
      documents: data.documents,
      mode: data.mode,
      database: data.database,
    };
  }
};
