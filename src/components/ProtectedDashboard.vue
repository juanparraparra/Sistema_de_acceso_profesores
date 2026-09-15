<template>
  <div id="protected-dashboard-view" class="space-y-6">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-emerald-200">
            {{ userInitials }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Prueba C: Vista Protegida Activa
              </span>
              <span class="text-xs text-slate-400 font-mono">/api/users/me</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {{ professor?.nombre || 'Profesor Autenticado' }}
            </h2>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Datos verificados desde la base de datos MongoDB mediante Bearer Token JWT
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            id="btn-refresh-me"
            @click="fetchProtectedData"
            :disabled="loading"
            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 border border-slate-200"
            title="Re-consultar /api/users/me con token"
          >
            <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" />
            <span>Actualizar datos</span>
          </button>
          <button
            id="btn-logout"
            @click="$emit('logout')"
            class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-2 border border-rose-200"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <!-- Error in fetching protected route -->
      <div 
        v-if="error" 
        class="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3"
      >
        <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <p class="font-bold">Error al consultar ruta protegida</p>
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Core Expected Response Grid: NOMBRE, CORREO Y ÁREA -->
      <div class="mt-6">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
          Respuesta Esperada en el Dashboard (Datos Básicos)
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- 1. Nombre -->
          <div id="stat-card-nombre" class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center gap-2 text-slate-500 mb-1">
              <User class="w-4 h-4 text-emerald-600" />
              <span class="text-xs font-bold uppercase tracking-wider">Nombre del Profesor</span>
            </div>
            <p class="text-base font-extrabold text-slate-900 truncate">
              {{ professor?.nombre || 'No disponible' }}
            </p>
            <span class="text-[10px] text-slate-400 mt-1 block">Validado desde MongoDB</span>
          </div>

          <!-- 2. Correo -->
          <div id="stat-card-correo" class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center gap-2 text-slate-500 mb-1">
              <Mail class="w-4 h-4 text-emerald-600" />
              <span class="text-xs font-bold uppercase tracking-wider">Correo Institucional</span>
            </div>
            <p class="text-base font-extrabold text-slate-900 truncate font-mono">
              {{ professor?.email || 'No disponible' }}
            </p>
            <span class="text-[10px] text-slate-400 mt-1 block">Identificador único</span>
          </div>

          <!-- 3. Área -->
          <div id="stat-card-area" class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center gap-2 text-slate-500 mb-1">
              <BookOpen class="w-4 h-4 text-emerald-600" />
              <span class="text-xs font-bold uppercase tracking-wider">Área / Especialidad</span>
            </div>
            <p class="text-base font-extrabold text-emerald-800 truncate">
              {{ professor?.area || 'No disponible' }}
            </p>
            <span class="text-[10px] text-slate-400 mt-1 block">Departamento académico</span>
          </div>
        </div>
      </div>

      <!-- Additional MongoDB Metadata -->
      <div class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span class="text-slate-500">MongoDB _id:</span>
          <span class="font-bold text-slate-800 truncate max-w-[150px]">{{ professor?._id }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span class="text-slate-500">Estado:</span>
          <span class="inline-flex items-center gap-1 font-bold text-emerald-700">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Activo
          </span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span class="text-slate-500">Registrado el:</span>
          <span class="font-bold text-slate-800">{{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Security & Evidence Accordion / Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-emerald-600" />
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Evidencia de Seguridad JWT & Consulta a MongoDB
          </h3>
        </div>
        <span class="text-xs text-slate-500 font-mono">HTTP 200 OK</span>
      </div>

      <!-- Raw API Response JSON -->
      <div class="relative">
        <div class="absolute top-2 right-2 flex items-center gap-1">
          <span class="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
            JSON Response
          </span>
        </div>
        <pre class="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">{{ rawResponseJson }}</pre>
      </div>

      <div class="mt-4 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
        <Lock class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p class="leading-relaxed">
          <span class="font-bold">Protección por Middleware:</span> Si la solicitud se realiza sin el encabezado 
          <code class="px-1.5 py-0.5 bg-amber-100 rounded font-mono font-bold text-amber-950">Authorization: Bearer &lt;token&gt;</code> 
          o si el token expira, Express rechaza el acceso automáticamente con código HTTP 
          <code class="px-1.5 py-0.5 bg-amber-100 rounded font-mono font-bold text-amber-950">401 Unauthorized</code>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  User, Mail, BookOpen, RefreshCw, Database, 
  AlertCircle, ShieldCheck, Lock, LogOut 
} from 'lucide-vue-next';
import { api } from '../services/api';
import { Profesor, ProtectedUserResponse } from '../types';

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const professor = ref<Profesor | null>(null);
const rawResponse = ref<ProtectedUserResponse | null>(null);
const loading = ref<boolean>(false);
const error = ref<string>('');

const userInitials = computed(() => {
  if (!professor.value?.nombre) return 'P';
  const parts = professor.value.nombre.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
});

const formattedDate = computed(() => {
  if (!professor.value?.createdAt) return 'Hoy';
  try {
    const d = new Date(professor.value.createdAt);
    return d.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return professor.value.createdAt;
  }
});

const rawResponseJson = computed(() => {
  if (!rawResponse.value) return '// Cargando datos de /api/users/me...';
  return JSON.stringify(rawResponse.value, null, 2);
});

async function fetchProtectedData() {
  loading.value = true;
  error.value = '';
  try {
    const data = await api.getMe();
    rawResponse.value = data;
    professor.value = data.user;
  } catch (err: any) {
    error.value = err.message || 'Error al obtener datos protegidos.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProtectedData();
});
</script>
