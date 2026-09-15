export interface Profesor {
  _id: string;
  nombre: string;
  email: string;
  area: string;
  telefono?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Profesor;
  error?: string;
  flow?: Record<string, string>;
}

export interface ProtectedUserResponse {
  success: boolean;
  message: string;
  user: Profesor;
  tokenMeta?: {
    tokenSubject?: string;
    authenticatedAt: string;
  };
  evidence?: {
    endpoint: string;
    authMethod: string;
    dbSource: string;
    deliveredFields: string[];
  };
  error?: string;
}

export interface DBStatus {
  connected: boolean;
  mode: 'MONGODB_ATLAS' | 'EMBEDDED_MONGODB';
  database: string;
  collection: string;
  host: string;
  totalDocuments: number;
  lastSync: string;
}

export interface MongoDocPreview {
  _id: string;
  nombre: string;
  email: string;
  password: string;
  area: string;
  telefono?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TelemetryStep {
  stepNumber: number;
  title: string;
  description: string;
  active: boolean;
  timestamp?: string;
  details?: string;
}
