<template>
  <div id="login-card" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-md w-full mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-700 shadow-xs">
        <LogIn class="w-6 h-6" />
      </div>
      <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Acceso de Profesores</h3>
      <p class="text-xs text-slate-500 mt-1">
        Prueba B: Autenticar el profesor y recibir token JWT válido
      </p>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="errorMessage" 
      id="login-error-alert"
      class="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
    >
      <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
      <div>
        <p class="font-bold">Error de Autenticación</p>
        <p class="mt-0.5 text-rose-700">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Success Alert -->
    <div 
      v-if="successMessage" 
      id="login-success-alert"
      class="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5"
    >
      <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      <div>
        <p class="font-bold">¡Autenticado con éxito!</p>
        <p class="mt-0.5 text-emerald-700">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="login-email" class="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          Correo Institucional
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail class="w-4 h-4" />
          </div>
          <input
            id="login-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="profesor@universidad.edu"
            class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="login-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Contraseña
          </label>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock class="w-4 h-4" />
          </div>
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
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
        id="btn-submit-login"
        type="submit"
        :disabled="loading"
        class="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm shadow-emerald-600/30 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <span>{{ loading ? 'Autenticando con Express & MongoDB...' : 'Iniciar Sesión (Paso 2)' }}</span>
      </button>
    </form>

    <!-- Demo Quick Credentials -->
    <div class="mt-6 pt-5 border-t border-slate-100">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
        Credencial de Demostración Sembrada
      </p>
      <button
        id="btn-fill-demo-login"
        type="button"
        @click="fillDemo"
        class="w-full p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 text-left transition-all group"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 group-hover:text-emerald-700">
            Dra. Carmen Valenzuela
          </span>
          <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
            Usar datos demo
          </span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5 font-mono truncate">
          carmen.valenzuela@universidad.edu • Clave: profesor123
        </p>
      </button>
    </div>

    <!-- Switch to Register Link -->
    <div class="mt-4 text-center">
      <p class="text-xs text-slate-500">
        ¿Aún no tiene cuenta registrada?
        <button
          type="button"
          @click="$emit('switch-to-register')"
          class="font-bold text-emerald-700 hover:text-emerald-800 hover:underline ml-1"
        >
          Crear registro de profesor (Prueba A)
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next';
import { api } from '../services/api';
import { AuthResponse } from '../types';

const emit = defineEmits<{
  (e: 'login-success', data: AuthResponse): void;
  (e: 'switch-to-register'): void;
}>();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

function fillDemo() {
  email.value = 'carmen.valenzuela@universidad.edu';
  password.value = 'profesor123';
  errorMessage.value = '';
}

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor complete todos los campos.';
    return;
  }

  loading.value = true;
  try {
    const res = await api.login({
      email: email.value.trim(),
      password: password.value,
    });

    successMessage.value = `Token JWT generado y validado para ${res.user?.nombre}. Redirigiendo a vista protegida...`;
    setTimeout(() => {
      emit('login-success', res);
    }, 600);
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al conectar con la API de autenticación.';
  } finally {
    loading.value = false;
  }
}
</script>
