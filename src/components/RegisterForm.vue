<template>
  <div id="register-card" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-lg w-full mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-3 text-teal-700 shadow-xs">
        <UserPlus class="w-6 h-6" />
      </div>
      <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Registro de Profesores</h3>
      <p class="text-xs text-slate-500 mt-1">
        Prueba A: Crear un profesor desde Vue y persistir en MongoDB
      </p>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="errorMessage" 
      id="register-error-alert"
      class="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
    >
      <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
      <div>
        <p class="font-bold">Error en Registro</p>
        <p class="mt-0.5 text-rose-700">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Success Feedback Panel -->
    <div 
      v-if="registeredData" 
      id="register-success-panel"
      class="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs"
    >
      <div class="flex items-start gap-2.5 mb-2">
        <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p class="font-bold text-sm text-emerald-800">¡Profesor Registrado y Persistido!</p>
          <p class="text-emerald-700 mt-0.5">
            El documento fue creado satisfactoriamente en la base de datos de MongoDB.
          </p>
        </div>
      </div>

      <!-- MongoDB Document Receipt Preview -->
      <div class="mt-3 p-3 rounded-lg bg-emerald-900/10 border border-emerald-300/40 font-mono text-[11px] space-y-1">
        <div class="flex justify-between">
          <span class="text-emerald-800 font-bold">_id (MongoDB):</span>
          <span class="text-slate-800 font-semibold">{{ registeredData.user?._id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-emerald-800 font-bold">Nombre:</span>
          <span class="text-slate-800">{{ registeredData.user?.nombre }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-emerald-800 font-bold">Área:</span>
          <span class="text-slate-800">{{ registeredData.user?.area }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-emerald-800 font-bold">JWT Token:</span>
          <span class="text-emerald-700 truncate max-w-[200px]">{{ registeredData.token }}</span>
        </div>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          @click="$emit('verify-mongo')"
          class="flex-1 py-2 px-3 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Database class="w-3.5 h-3.5 text-emerald-600" />
          <span>Verificar en MongoDB (Prueba A)</span>
        </button>
        <button
          type="button"
          @click="$emit('register-success', registeredData)"
          class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Ir a Ruta Protegida (Prueba C)</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Register Form -->
    <form v-if="!registeredData" @submit.prevent="handleRegister" class="space-y-4">
      <!-- Nombre Completo -->
      <div>
        <label for="reg-nombre" class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
          Nombre Completo del Profesor *
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User class="w-4 h-4" />
          </div>
          <input
            id="reg-nombre"
            v-model="form.nombre"
            type="text"
            required
            placeholder="Ej. Dr. Fernando Torres"
            class="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      <!-- Correo Institucional -->
      <div>
        <label for="reg-email" class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
          Correo Institucional *
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail class="w-4 h-4" />
          </div>
          <input
            id="reg-email"
            v-model="form.email"
            type="email"
            required
            placeholder="fernando.torres@universidad.edu"
            class="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      <!-- Área Académica -->
      <div>
        <label for="reg-area" class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
          Área / Departamento Académico *
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <BookOpen class="w-4 h-4" />
          </div>
          <select
            id="reg-area"
            v-model="form.area"
            required
            class="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          >
            <option value="" disabled>Seleccione el área del profesor</option>
            <option value="Ciencias de la Computación e IA">Ciencias de la Computación e IA</option>
            <option value="Ingeniería de Software y Sistemas">Ingeniería de Software y Sistemas</option>
            <option value="Matemáticas y Estadística">Matemáticas y Estadística</option>
            <option value="Física y Química Aplicada">Física y Química Aplicada</option>
            <option value="Ciencias Biológicas y de la Salud">Ciencias Biológicas y de la Salud</option>
            <option value="Humanidades y Filosofía">Humanidades y Filosofía</option>
            <option value="Idiomas y Lingüística">Idiomas y Lingüística</option>
            <option value="Economía y Ciencias Empresariales">Economía y Ciencias Empresariales</option>
          </select>
        </div>
      </div>

      <!-- Teléfono (Opcional) -->
      <div>
        <label for="reg-tel" class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
          Teléfono Institucional (Opcional)
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Phone class="w-4 h-4" />
          </div>
          <input
            id="reg-tel"
            v-model="form.telefono"
            type="text"
            placeholder="+52 55 4321 9876"
            class="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      <!-- Contraseña -->
      <div>
        <label for="reg-password" class="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
          Contraseña * (Mínimo 6 caracteres)
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock class="w-4 h-4" />
          </div>
          <input
            id="reg-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        id="btn-submit-register"
        type="submit"
        :disabled="loading"
        class="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm shadow-teal-600/30 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <span>{{ loading ? 'Registrando en Express & MongoDB...' : 'Completar Registro (Pasos 1 a 5)' }}</span>
      </button>
    </form>

    <!-- Switch to Login Link -->
    <div v-if="!registeredData" class="mt-4 text-center">
      <p class="text-xs text-slate-500">
        ¿Ya tiene una cuenta de profesor registrada?
        <button
          type="button"
          @click="$emit('switch-to-login')"
          class="font-bold text-teal-700 hover:text-teal-800 hover:underline ml-1"
        >
          Iniciar sesión (Prueba B)
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { 
  UserPlus, User, Mail, BookOpen, Phone, Lock, Eye, EyeOff, 
  AlertCircle, CheckCircle2, Loader2, Database, ArrowRight 
} from 'lucide-vue-next';
import { api } from '../services/api';
import { AuthResponse } from '../types';

const emit = defineEmits<{
  (e: 'register-success', data: AuthResponse): void;
  (e: 'switch-to-login'): void;
  (e: 'verify-mongo'): void;
}>();

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  area: 'Ciencias de la Computación e IA',
  telefono: '',
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const registeredData = ref<AuthResponse | null>(null);

async function handleRegister() {
  errorMessage.value = '';

  if (!form.nombre.trim() || !form.email.trim() || !form.password || !form.area) {
    errorMessage.value = 'Por favor complete todos los campos obligatorios.';
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  loading.value = true;
  try {
    const res = await api.register({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      password: form.password,
      area: form.area,
      telefono: form.telefono.trim(),
    });

    registeredData.value = res;
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al procesar registro en el servidor Express.';
  } finally {
    loading.value = false;
  }
}
</script>
